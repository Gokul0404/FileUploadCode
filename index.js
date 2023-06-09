const express = require('express')
const app = express();
const path = require('path');
const multer = require('multer');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

var storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, 'uploads')

    },
    filename: function (req, file, cb) {
        cb(null, file.originalname.replace(/\.[^/.]+$/,'') + '_' + Date.now() + path.extname(file.originalname))
    }
})


let maxsize=2 * 1000 * 1000

let upload = multer({

    storage: storage,
    limits: {

        fileSize: maxsize
    },
    fileFilter: function (req, file, cb) {
        
       let filetypes = /.jpeg|.jpg|.png/;
        let mimetype = filetypes.test(file.mimetype)
        let extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
  
        }

        cb('Error:file upload only supports the following filetypes:' + filetypes)
    }
}).single('mypic');

app.get('/', (req, res) => {
    
res.render('signup')
})

app.post('/upload', (req, res, next) => {
    
    upload(req, res, function (err) {
        if (err) {
            if (err instanceof multer.MulterError && err.code == "LIMIT_FILE_SIZE") {
                res.send('File size is maximam 2mb')
            
        }
            res.send(err);

        } else
        {
            res.send('Success. Image Uploaded!')
            }
})
})
app.listen(8080, () => {
    
    console.log('server is runing');
})