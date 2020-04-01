const cloudinary = require('cloudinary');


cloudinary.config({
    cloud_name: 'dlpicrrw3',
    api_key: '226536844262825',
    api_secret: '1q0B2yBJcvVO4lggMd34iD4A8VQ'
});

class UploadImage {

    async upload(req, res) {
        try {
            cloudinary.uploader.upload(req.body.data, (result) => {
                if (result.error) {
                    return res.json({ execute: false, message: 'Something wrong, try later.' })
                }else{
                    return res.json({ execute: true, url: result.url })
                }   
            });
        } catch (err) {
            console.log(err)
            return res.json({ execute: false, message: 'Something wrong, try later.' })
        }
    }

}

module.exports = UploadImage