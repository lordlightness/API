const ig = require("instatouch");
const dotenv = require('dotenv').config()
const sID = process.env.sID;

const options = {
  count: 0,
  mediaType: "all",
  timeout: 0,
  session: "sessionid=" + sID
};

async function igStalk(req, res) {
	const apikey = req.query.apikey;
    if (apikey === undefined) return res.status(404).send({
        status: 404,
        message: `Input Parameter apikey`
    });
    const check = await cekKey(apikey);
    if (!check) return res.status(403).send({
        status: 403,
        message: `apikey ${apikey} not found, please register first!`
    });
    const username = req.query.username;
    if (username === undefined) return res.status(404).send({
        status: 404,
        message: `Input Parameter username`
    });
      ig.getUserMeta(username, options)
        .then(result => {
        res.status(200).send({
        	  status: 200,
              profile: result.graphql.user.profile_pic_url,
              profilehd: result.graphql.user.profile_pic_url_hd,
              fullname: result.graphql.user.full_name,
              private: result.graphql.user.is_private,
              verified: result.graphql.user.is_verified,
              bio: result.graphql.user.biography,
              follower: result.graphql.user.edge_followed_by.count,
              following: result.graphql.user.edge_follow.count,
              conneted_fb: result.graphql.user.connected_fb_page,
              videotimeline: result.graphql.user.edge_felix_video_timeline.count,
              timeline: result.graphql.user.edge_owner_to_timeline_media.count,
              savedmedia: result.graphql.user.edge_saved_media.count,
              collections: result.graphql.user.edge_media_collections.count
          });
        }).catch(error => {
        console.log(error);
        res.status(500).send({status: 500, message: 'Username tidak ditemukan!'});
    });
}

async function igDownload(req, res) {
  const apikey = req.query.apikey;
    if (apikey === undefined) return res.status(404).send({
        status: 404,
        message: `Input Parameter apikey`
    });
    const check = await cekKey(apikey);
    if (!check) return res.status(403).send({
        status: 403,
        message: `apikey ${apikey} not found, please register first!`
    });
    const url = req.query.url;
    if (url === undefined) return res.status(404).send({
        status: 404,
        message: `Input Parameter url`
    });
      ig.getPostMeta(url, options)
      .then(result => {
        res.status(200).send({
          status: 200,
          id: result.graphql.shortcode_media.id,
          shortCode: result.graphql.shortcode_media.shortcode,
          caption: result.graphql.shortcode_media.edge_media_to_caption.edges[0].node.text,
          url: result.graphql.shortcode_media.display_url
        })
      }).catch(error => {
        console.log(error);
        res.status(500).send({status: 500, message: 'Username tidak ditemukan!'});
    });
}

module.exports = {
  igStalk,
  igDownload
};