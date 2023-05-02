const express = require("express")
const axios = require('axios');
const ipRouter = express.Router()
const redisClient = require("../redis");
const Search = require("../models/searchmodel")
const { authenticator } = require("../middlewares/auth");
// const validateIp = require("../middlewares/validateIP")


ipRouter.get('/:ipAddress/city', authenticator, async (req, res) => {
  try {

    const ipAddress = req.params.ipAddress;


    const isCached = await redisClient.get(`${ipAddress}`);

    if (!isCached){
        const response = await axios.get(`https://ipapi.co/${ipAddress}/json/`);
        const city = response.data.city;

        // const newSearch = new Search({userId, ipAddress, city});
        // await newSearch.save();

        await redisClient.set(ipAddress, city, { EX: 6*60*60 })
        return res.json({ city });
    }
    // const newSearch = new Search({userId, ipAddress, city: isCached});
    // await newSearch.save();
    console.log("Retrived from cache")
    res.status(200).json({city: isCached})

  } catch (err) {

    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = {ipRouter}