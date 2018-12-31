const fs = require('fs')
const sharp = require('sharp')

exports.createImage = async ctx => {
    const ext = ctx.req.file.originalname.substr(ctx.req.file.originalname.lastIndexOf('.'), ctx.req.file.originalname.length).toLowerCase()
    const filename = ctx.req.file.filename
    try {
        fs.readFile(`./img/${filename}`, (err, data) => {
            if (err) throw new Error({ status: 'fail' })
            if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
                const image = sharp(data)
                image.metadata()
                    .then((metadata) => image.resize(Math.min(metadata.width, 960))
                        .jpeg(80)
                        .toBuffer()
                    )
                    .then(result => fs.writeFile(`./img/${filename}`, result, () => { }))
            }
            const thumbnail = sharp(data)
            thumbnail.metadata()
                .then(() => thumbnail.resize(100, 100)
                    .toBuffer()
                )
                .then(result => fs.writeFile(`./img/thumb/${filename}`, result, () => { }))
        })
        ctx.body = { filename, status: 'ok' }
    } catch (e) {
        ctx.body = e
    }
}