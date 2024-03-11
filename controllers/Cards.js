import Upload from "../models/Upload.js";

export const getUploads = async (req, res) => {
  try {
    const cards = await Upload.find();
    res.status(200).json(cards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadFile = async (req, res) => {
  try {
    const { text, userPosted, userId } = req.body;

    let fileUrl = "";

    if (req.file) {
      fileUrl = `https://stack-ovelflow-clone.onrender.com/uploads/${req.file.filename}`;
    }

    const newUpload = new Upload({ text, file: fileUrl, userPosted, userId });
    await newUpload.save();

    res.status(200).json({ message: "Upload successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
