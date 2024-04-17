import { User } from "../models/user.model.js"

export const createUser = async (user) => {
  try {
    const newUser = await User.create(user)
    return JSON.parse(JSON.stringify(newUser));
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

    return JSON.parse(JSON.stringify(updatedUser));
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

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
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

    res.status(200).json(updateCredits)
  } catch (err) {
    next(err);
  }
}