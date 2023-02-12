const Records = require('./records.model');
const csvToJson = require('csvtojson');

const upload = async (req, res) => {
    const {file} = req; //Recibimos el archivo enviado por req
    try{
        const csv = await csvToJson().fromFile(file.path); // Transformamos el csv a json para poder cargarlo en la bd.   
        await Records.insertMany(csv, {ordered: false, writeConcern:{w:0}}) /* Insertamos los registros en la bd. 
                                                                            Seteamos ordered en false y writeConcern en 0 para mejorar el rendimiento*/
        res.send("Upload completed")
    } catch (error) {
        res.send("Upload failed", error)
    }
}


const list = async (_, res) => {
    try {
        const data = await Records
            .find({})
            .limit(10)
            .lean();
        
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json(err);
    }
};

module.exports = {
    upload,
    list,
};
