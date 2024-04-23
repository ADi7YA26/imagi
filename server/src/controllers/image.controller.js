import { User } from "../models/user.model.js"
import { Image } from "../models/image.model.js"

const populateUser = (query) => query.populate({
  path: 'author',
  model: User,
  select: '_id firstName lastName clerkId'
})

// ADD IMAGE
export const addImage = async (req, res, next) =>  {
  try {
    const { image, userId} = req.body;

    const author = await User.findById(userId);

    if (!author) {
      throw new Error("User not found");
    }

    const newImage = new Image({
      ...image,
      author: author._id,
    })

    await newImage.save();

    res.status(201).json(newImage);
  } catch (err) {
    next(err)
  }
}

// UPDATE IMAGE
export const updateImage = async (req, res, next) => {
  try {
    const { image, userId } = req.body;
    const imageToUpdate = await Image.findById(image._id);

    if (!imageToUpdate || imageToUpdate.author.toHexString() !== userId) {
      throw new Error("Unauthorized or image not found");
    }

    const updatedImage = await Image.findByIdAndUpdate(
      imageToUpdate._id,
      image,
      { new: true }
    )

    res.status(200).json(updatedImage);
  } catch (err) {
    next(err)
  }
}

// DELETE IMAGE
export const deleteImage = async (req, res, next) => {
  try {
    const { imageId } = req.params;
    const imageToDelete = await Image.findByIdAndDelete(imageId);

    if (!imageToDelete) {
      throw new Error("Image not found");
    }

    res.status(204).send();
  } catch (err) {
    next(err)
  }
}

// GET IMAGE
export const getImageById = async (req, res, next) => {
  try {
    const { imageId } = req.params;

    const image = await populateUser(Image.findById(imageId));

    if(!image) throw new Error("Image not found");

    return JSON.parse(JSON.stringify(image));
  } catch (err) {
    next(err)
  }
}

// GET IMAGES
export const getAllImages = async(req, res, next) => {
  try {
    const { limit = 9, page = 1, searchQuery = '' } = req.query;

    let query = {};

    if (searchQuery) {
      const { resources } = await cloudinary.search
        .expression(`folder=imaginify AND ${searchQuery}`)
        .execute();

      const resourceIds = resources.map((resource) => resource.public_id);
      query = { publicId: { $in: resourceIds } };
    }

    const skipAmount = (Number(page) - 1) * limit;
    const totalImages = await Image.find(query).countDocuments();

    const images = await Image.find(query)
      .populate('author')
      .sort({ updatedAt: -1 })
      .skip(skipAmount)
      .limit(limit);

    const totalPages = Math.ceil(totalImages / limit);

    res.status(200).json({ data: images, totalPages, });
  } catch (err) {
    next(err)
  }
}

// GET IMAGES BY USER
export const getUserImages = async (req, res, next) => {
  try {
    const {limit = 9,page = 1,userId} = req.body;
    const skipAmount = (Number(page) - 1) * limit;

    const images = await populateUser(Image.find({ author: userId }))
      .sort({ updatedAt: -1 })
      .skip(skipAmount)
      .limit(limit);

    const totalImages = await Image.find({ author: userId }).countDocuments();

    res.status(200).json({ data: images, totalPages: Math.ceil(totalImages / limit) });
  } catch (err) {
    next(err);
  }
}