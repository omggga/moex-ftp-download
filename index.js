'use strict'

const stream = require('stream')
const ftp = require("basic-ftp")
const fs = require("fs")

const config = {
	moex: {
		user: '#######',
		password: '#####',
		host: 'ftps.moex.com',
		secure: true
	}
}

async function example() {
    const client = new ftp.Client()
    client.ftp.verbose = true

    const ws = new stream.PassThrough()  
    try {
        await client.access(config.moex)
        await client.cd('EQ')
        await client.cd('20181018')
        const filesList = await client.list()
        for (let i = 0; i < filesList.length; i++) {
            const wr = fs.createWriteStream(filesList[i].name)
            await client.download(wr, filesList[i].name, 0)
            wr.end()
        }
        client.close()    
    } catch(err) {
        console.log(err)
    }
}