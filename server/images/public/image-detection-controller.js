//1. identify elements
const image = document.getElementById("nsfw-image");
const imageWidth = image.getAttribute("width");
const imageHeight = image.getAttribute("height");
const canvas = document.getElementById("detection-canvas");

//2. load model.json file
async function runCoco() {
    const net = await tf.loadGraphModel("tfjs-models/nsfw/model.json");
    setInterval(() => {
        detect(net);
    }, 16.7);
};
runCoco();

async function detect(net) {
    // 4. TODO - Make Detections
    const img = tf.browser.fromPixels(image);
    const resized = tf.image.resizeBilinear(img, [imageWidth, imageHeight]);
    const casted = resized.cast('int32');
    const expanded = casted.expandDims(0);
    const obj = await net.executeAsync(expanded);

    //console.log(await obj[3].array());

    const boxes = await obj[3].array();
    const classes = await obj[2].array();
    const scores = await obj[4].array();

    // Draw mesh
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    tf.dispose(img);
    tf.dispose(resized);
    tf.dispose(casted);
    tf.dispose(expanded);
    tf.dispose(obj);
    drawRect(boxes[0], classes[0], scores[0], 0.6, imageWidth, imageHeight, ctx)
}

const labelMap = {
    1: { name: 'Breast', color: 'yellow' },
    2: { name: 'Missv', color: 'green' },
    3: { name: 'Mrp', color: 'blue' }
}

function drawRect(boxes, classes, scores, threshold, imgWidth, imgHeight, ctx) {
    for (let i = 0; i <= boxes.length; i++) {
        if (boxes[i] && classes[i] && scores[i] > threshold) {
            // Extract variables
            const [y, x, height, width] = boxes[i]
            const text = classes[i]

            // Set styling
            ctx.strokeStyle = labelMap[text]['color']
            ctx.lineWidth = 3                           //rectangle stroke width
            ctx.fillStyle = 'white'                      //label color
            ctx.font = '16px Arial bold'                     //label font size and family

            //draw label, stroke or rectangle
            ctx.beginPath()
            //show label
            ctx.fillText(labelMap[text]['name'] + ' - ' + Math.round(scores[i] * 100) + "%", x * imgWidth + 5, y * imgHeight - 5)

            //show stroke
            ctx.rect(x * imgWidth, y * imgHeight, width * imgWidth / 2, height * imgHeight / 2);
            ctx.stroke()

            //show rectangle/censorship
            ctx.fillStyle = "red";
            ctx.fillRect(x * imgWidth, y * imgHeight, width * imgWidth / 2, height * imgHeight / 2);
        }
    }
}