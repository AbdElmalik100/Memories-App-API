import multer from "multer";


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}_${file.originalname}`        
        cb(null, fileName)
    }
})

const upload = multer({ storage: storage }); // Destination for uploaded files

export default upload