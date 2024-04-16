import { User } from "../models/user.model.js"

export const createUser = async (user) => {
  try {
    const newUser = await User.create(user)
    await newUser.save()
    res.status(201).json(newUser)
  } catch (err) {
    next(err)
  }
}

export const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params
    const user = await User.find({clerkId: userId});

    if (!user) throw new Error("User not found");

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

export const updateUser = async (clerkId, user) => {
  try {
    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error("User update failed");

    res.status(200).json(updateUser)
  } catch (err) {
    next(err)
  }
}

export const deleteUser = async (clerkId) => {
  try{

    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    const deletedUser = await User.findByIdAndDelete(userToDelete._id);

    res.status(200).json("User has been deleted.")
  }catch{
    next(err)
  }
}

export const updateCredits = async (req, res, next) => {
  try {
    const { userId, creditFee } = req.body();
    const updatedUserCredits = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { creditBalance: creditFee }},
      { new: true }
    )

    if(!updatedUserCredits) throw new Error("User credits update failed");

    return JSON.parse(JSON.stringify(updatedUserCredits));
  } catch (err) {
    next(err);
  }
}