import { Webhook } from "svix";
import { createUser, updateUser, deleteUser } from "./user.controller.js";
 
export const clerkController = async (req, res, next) => {
  // Check if the 'Signing Secret' from the Clerk Dashboard was correctly provided
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!CLERK_WEBHOOK_SECRET) {
    throw new Error("You need a CLERK_WEBHOOK_SECRET in your .env");
  }

  // Grab the headers and body
  const headers = req.headers;
  const payload = req.body;

  // Get the Svix headers for verification
  const svix_id = headers?.["svix-id"];
  const svix_timestamp = headers?.["svix-timestamp"];
  const svix_signature = headers?.["svix-signature"];

  // If there are missing Svix headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Initiate Svix
  const wh = new Webhook(CLERK_WEBHOOK_SECRET);

  let evt;

  // Attempt to verify the incoming webhook
  // If successful, the payload will be available from 'evt'
  // If the verification fails, error out and  return error code
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) ;
  } catch (err) {
    // Console log and return error
    console.log("Webhook failed to verify. Error:", err.message);
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Grab the ID and TYPE of the Webhook
  const { id } = evt.data;
  const eventType = evt.type;

  // CREATE
  try {

    if (eventType === "user.created") {
      const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;

      const user = {
        clerkId: id,
        email: email_addresses[0].email_address,
        username: username,
        firstName: first_name,
        lastName: last_name,
        photo: image_url,
      };

      const newUser = await createUser(user);

      // Set public metadata
      if (newUser) {
        await clerkClient.users.updateUserMetadata(id, {
          publicMetadata: {
            userId: newUser._id,
          },
        });
      }

      res.status(201).json({message:"OK", user:newUser})
    }

    // UPDATE
    else if (eventType === "user.updated") {
      const { id, image_url, first_name, last_name, username } = evt.data;

      const user = {
        firstName: first_name,
        lastName: last_name,
        username: username,
        photo: image_url,
      };

      const updatedUser = await updateUser(id, user);

      res.status(200).json({message:"OK", user:updatedUser})

    }

    // DELETE
    else if (eventType === "user.deleted") {
      const { id } = evt.data;

      const deletedUser = await deleteUser(id);
      
      res.status(200).json({message:"OK", user:deletedUser})
    }

    else{
      console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
      // Console log the full payload to view
      console.log("Webhook body:", evt.data);
    
      return res.status(200).json({
        success: true,
        message: "Webhook received",
      });
    }
  } catch (err) {
    next(err)
  }
  
}