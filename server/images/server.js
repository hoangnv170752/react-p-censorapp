const express = require('express'); 
const bodyParser = require('body-parser');
const multer = require('multer');
const tf = require('@tensorflow/tfjs-node');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express(); 
const server = require('http').Server(app);

app.use(cors({origin: '*'}));

server.listen(process.env.PORT || 4444);

app.use(express.static('public'));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.get('/', (req, res) => { 
  res.render('index'); 
});

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Load the TensorFlow model
let model;
tf.loadGraphModel('file://public/tfjs-models/nsfw/model.json').then(loadedModel => {
    model = loadedModel;
    console.log('Model loaded');
}).catch(err => {
    console.error('Error loading model:', err);
});

// Detection API route
app.post('/api/detect', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ error: 'No file uploaded' });
    }

    try {
        const imagePath = path.resolve(req.file.path);
        const imageBuffer = fs.readFileSync(imagePath);
        const imageTensor = tf.node.decodeImage(imageBuffer, 3).expandDims(0);

        const detections = await model.executeAsync(imageTensor);

        const boxes = await detections[3].array();
        const classes = await detections[2].array();
        const scores = await detections[4].array();

        tf.dispose(detections);
        tf.dispose(imageTensor);

        res.json({
            boxes: boxes[0],
            classes: classes[0],
            scores: scores[0],
        });

        // Optionally clean up the uploaded file
        fs.unlinkSync(imagePath);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Error processing image' });
    }
});