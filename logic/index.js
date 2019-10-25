const { Group, Channel, Subchannel, Content, Pdf, Video, Text } = require('../models')
const validate = require('../common/validate')
const fs = require('fs');
const Json2csvParser = require('json2csv').Parser;
const logic = {

    /***********************************GROUP*********************************************/

    /**
     * creates a groupe that channels will belong to
     * 
     * @param {String} name 
     * @param {String} description 
     *  
     */
    addGroup(name, description) {
        validate.arguments([
            { name: 'name', value: name, type: 'string', notEmpty: true },
            { name: 'description', value: description, type: 'string', notEmpty: true }
        ])

        return (async () => {
            try {
                const group = new Group({
                    name,
                    description
                })
                return await group.save();
            } catch (error) {
                throw new Error(error.message);
            }
        })()
    },

    /**
     * Retrieve a group and all the channels that are referenced to this group
     * 
     * 
     * @param {String} id 
     * 
     * @throws {Error} if the group has not been found
     */
    retrieveGroupWithChannels(id) {
        validate.arguments([
            { name: 'id', value: id, type: 'string', notEmpty: true }
        ])

        return (async () => {
            try {
                const group = await Group.findById(id).lean()
                if (!group) throw Error(`No_group_found`)

                group.id = group._id.toString()
                delete group._id
                delete group.__v

                const channels = await Channel.find({ groups: id }).populate('groups').lean()

                channels.map(channel => {
                    channel.groups.map(element => {
                        if (element._id) element.id = element._id
                        delete element.__v
                        delete element._id
                    })
                    channel.id = channel._id
                    delete channel._id
                    delete channel.__v
                })

                return { group, channels }

            } catch (error) {
                throw new Error(error.message);
            }
        })()
    },

    /***********************************CHANNEL*********************************************/

    /**
     * Creates a channel that can belong to different groups
     * 
     * @param {Array} group_Ids 
     * @param {String} title 
     * @param {String} language 
     * @param {String} picture 
     * @param {Boolean} has_subchannels 
     *      
     * @throws {Error} if the group has not been found
     */
    addChannel(group_Ids, title, language, picture, has_subchannels) {
        validate.arguments([
            { name: 'group_Ids', value: group_Ids, type: 'array', notEmpty: true },
            { name: 'title', value: title, type: 'string', notEmpty: true },
            { name: 'language', value: language, type: 'string', notEmpty: true },
            { name: 'picture', value: picture, type: 'string', notEmpty: true },
            { name: 'has_subchannels', value: has_subchannels, type: 'boolean', notEmpty: true }
        ])

        return (async () => {
            try {
                const groups = []

                const promises = group_Ids.map(async (element) => {
                    const group = await Group.findById(element)
                    if (!group) throw Error(`No_group_found`)

                    groups.push(group)
                })

                await Promise.all(promises);

                const channel = new Channel({ groups, title, language, picture, has_subchannels })

                return await channel.save();
            } catch (error) {
                throw new Error(error.message);
            }
        })()
    },

    /***********************************CONTENT-CHANNELS*********************************************/

    /**
     * It adds a video content to the channels without subchannels
     * 
     * @param {String} channel_id 
     * @param {String} type 
     * @param {String} title 
     * @param {String} author 
     * @param {String} movie_director 
     * @param {String} genre 
     * @param {String} description 
     * @param {String} file_url 
     * 
     * @throws {Error} if the channel has not been found
     * @throws {Error} if the 'has_subchannels' boolean is true
     * @throws {Error} the variable 'type' should be 'video'
     */
    addVideoContent(channel_id, type, title, author, movie_director, genre, description, file_url) {
        validate.arguments([
            { name: 'channel_id', value: channel_id, type: 'string', notEmpty: true },
            { name: 'type', value: type, type: 'string', notEmpty: true },
            { name: 'title', value: title, type: 'string', notEmpty: true },
            { name: 'author', value: author, type: 'string', notEmpty: true },
            { name: 'genre', value: genre, type: 'string', notEmpty: true },
            { name: 'description', value: description, type: 'string', notEmpty: true },
            { name: 'file_url', value: file_url, type: 'string', notEmpty: true }
        ])

        return (async () => {
            try {
                if (type === 'video') {
                    const channel = await Channel.findById(channel_id)
                    if (!channel) throw Error(`No_channel_found`)

                    if (channel.has_subchannels) throw Error(`This channel doest not allow content, please add content to subchannels`)

                    const video = new Video({ title, author, movie_director, genre, description, file_url })

                    const content_post = new Content({ type, video })

                    channel.content.push(content_post)

                    await channel.save()

                    return content_post
                }

                if (type !== 'video') throw Error(`please indicate that type is video`)

            } catch (error) {
                throw new Error(error.message)
            }
        })()
    },

    /**
     * It adds a pdf content to the channels without subchannels
     * 
     * @param {String} channel_id 
     * @param {String} type 
     * @param {String} title 
     * @param {String} author 
     * @param {String} description 
     * @param {String} file_url 
     * 
     * @throws {Error} if the channel has not been found
     * @throws {Error} if the 'has_subchannels' boolean is true
     * @throws {Error} the variable 'type' should be 'pdf'
     */
    addPdfContent(channel_id, type, title, author, description, file_url) {
        validate.arguments([
            { name: 'channel_id', value: channel_id, type: 'string', notEmpty: true },
            { name: 'type', value: type, type: 'string', notEmpty: true },
            { name: 'title', value: title, type: 'string', notEmpty: true },
            { name: 'author', value: author, type: 'string', notEmpty: true },
            { name: 'description', value: description, type: 'string', notEmpty: true },
            { name: 'file_url', value: file_url, type: 'string', notEmpty: true }
        ])
        return (async () => {
            try {
                if (type === 'pdf') {
                    const channel = await Channel.findById(channel_id)
                    if (!channel) throw Error(`No_channel_found`)

                    if (channel.has_subchannels) throw Error(`This channel doest not allow content, please add content to subchannels`)

                    const pdf = new Pdf({ title, author, description, file_url })

                    const content_post = new Content({ type, pdf })

                    channel.content.push(content_post)

                    await channel.save()

                    return content_post
                }

                if (type !== 'pdf') throw Error(`please indicate that type is pdf`)
            } catch (error) {
                throw new Error(error.message);
            }
        })()

    },

    /**
     * It adds a text content to the channels without subchannels
     * 
     * @param {String} channel_id 
     * @param {String} type 
     * @param {String} title 
     * @param {String} author 
     * @param {String} text_body 
     * 
     * @throws {Error} if the channel has not been found
     * @throws {Error} if the 'has_subchannels' boolean is true
     * @throws {Error} the variable 'type' should be 'text'
     */
    addTextContent(channel_id, type, title, author, text_body) {
        validate.arguments([
            { name: 'channel_id', value: channel_id, type: 'string', notEmpty: true },
            { name: 'type', value: type, type: 'string', notEmpty: true },
            { name: 'title', value: title, type: 'string', notEmpty: true },
            { name: 'author', value: author, type: 'string', notEmpty: true },
            { name: 'text_body', value: text_body, type: 'string', notEmpty: true }
        ])
        return (async () => {
            try {

                if (type === 'text') {
                    const channel = await Channel.findById(channel_id)
                    if (!channel) throw Error(`No_channel_found`)

                    if (channel.has_subchannels) throw Error(`This channel doest not allow content, please add content to subchannels`)

                    const text = new Text({ title, author, text_body })

                    const content_post = new Content({ type, text })

                    channel.content.push(content_post)

                    await channel.save()

                    return content_post
                }

                if (type !== 'text') throw Error(`please indicate that type is text`)
            } catch (error) {
                throw new Error(error.message)
            }
        })()

    },

    /***********************************SUBCHANNELS*******************************************/
    
    /**
     * it creates subchannels nested on channels
     * 
     * @param {String} channel_id 
     * @param {String} title 
     * @param {String} language 
     * @param {String} picture 
     * 
     * @throws {Error} if the channel does not allow to add subchannels
     */
    addSubchannels(channel_id, title, language, picture) {
        validate.arguments([
            { name: 'channel_id', value: channel_id, type: 'string', notEmpty: true },
            { name: 'title', value: title, type: 'string', notEmpty: true },
            { name: 'language', value: language, type: 'string', notEmpty: true },
            { name: 'picture', value: picture, type: 'string', notEmpty: true }
        ])

        return (async () => {
            try {
                const channel = await Channel.findById(channel_id)

                if (!channel) throw Error(`No_channel_found`)

                if (channel.has_subchannels) {

                    const subchannel = new Subchannel({ title, language, picture })

                    channel.subchannels.push(subchannel)

                    await channel.save()

                    return subchannel
                }
                if (!channel.has_subchannels) throw Error(`this channel does not allow to add subchannels to this channel`)

            } catch (error) {
                throw new Error(error.message);
            }
        })()
    },

    /***********************************CONTENT-SUBCHANNELS*********************************************/

    /**
     * it adds content video nested to the subchannel that belong to a channnel 
     * 
     * @param {String} channel_id 
     * @param {String} subchannel_id 
     * @param {String} type 
     * @param {String} title 
     * @param {String} author 
     * @param {String} movie_director 
     * @param {String} genre 
     * @param {String} description 
     * @param {String} file_url
     * 
     * @throws {Error} if the channel has not been found
     * @throws {Error} if the channel does not accept subchannels content
     * @throws {Error} if the subchannel has not been found
     * @throws {Error} the variable 'type' should be 'video' 
     */
    addSubchannelVideoContent(channel_id, subchannel_id, type, title, author, movie_director, genre, description, file_url) {
        validate.arguments([
            { name: 'channel_id', value: channel_id, type: 'string', notEmpty: true },
            { name: 'subchannel_id', value: subchannel_id, type: 'string', notEmpty: true },
            { name: 'type', value: type, type: 'string', notEmpty: true },
            { name: 'title', value: title, type: 'string', notEmpty: true },
            { name: 'author', value: author, type: 'string', notEmpty: true },
            { name: 'genre', value: genre, type: 'string', notEmpty: true },
            { name: 'description', value: description, type: 'string', notEmpty: true },
            { name: 'file_url', value: file_url, type: 'string', notEmpty: true }
        ])

        return (async () => {
            try {
                if (type === 'video') {
                    const channel = await Channel.findById(channel_id)
                    if (!channel) throw Error(`No_channel_found`)

                    if (channel.has_subchannels) {

                        const index_subchannel = channel.subchannels.findIndex(element => element._id.toString() === subchannel_id)
                        if (index_subchannel === -1) throw Error(`No_subchannel_found`)

                        const video = new Video({ title, author, movie_director, genre, description, file_url })

                        const content_post = new Content({ type, video })

                        channel.subchannels[index_subchannel].content.push(content_post)

                        await channel.save()

                        return content_post
                    }
                    if (!channel.has_subchannels) throw Error(`channel does not accept subchannel content`)
                }

                if (type !== 'video') throw Error(`please indicate that type is video`)

            } catch (error) {
                throw new Error(error.message);
            }
        })()
    },

    /**
     * it adds content pdf nested to the subchannel that belong to a channnel 
     * 
     *  
     * @param {String} channel_id 
     * @param {String} subchannel_id 
     * @param {String} type 
     * @param {String} title 
     * @param {String} author 
     * @param {String} description 
     * @param {String} file_url 
     * 
     * @throws {Error} if the channel has not been found
     * @throws {Error} if the channel does not accept subchannels content
     * @throws {Error} if the subchannel has not been found
     * @throws {Error} the variable 'type' should be 'pdf' 
     */
    addSubchannelPdfContent(channel_id, subchannel_id, type, title, author, description, file_url) {
        validate.arguments([
            { name: 'channel_id', value: channel_id, type: 'string', notEmpty: true },
            { name: 'subchannel_id', value: subchannel_id, type: 'string', notEmpty: true },
            { name: 'type', value: type, type: 'string', notEmpty: true },
            { name: 'title', value: title, type: 'string', notEmpty: true },
            { name: 'author', value: author, type: 'string', notEmpty: true },
            { name: 'description', value: description, type: 'string', notEmpty: true },
            { name: 'file_url', value: file_url, type: 'string', notEmpty: true }
        ])
        return (async () => {
            try {
                if (type === 'pdf') {
                    
                    const channel = await Channel.findById(channel_id)
                    if (!channel) throw Error(`No_channel_found`)

                    if (channel.has_subchannels) {

                        const index_subchannel = channel.subchannels.findIndex(element => element._id.toString() === subchannel_id)
                        if (index_subchannel === -1) throw Error(`No_subchannel_found`)

                        const pdf = new Pdf({ title, author, description, file_url })

                        const content_post = new Content({ type, pdf })

                        channel.subchannels[index_subchannel].content.push(content_post)

                        await channel.save()

                        return content_post

                    }

                    if (!channel.has_subchannels) throw Error(`channel does not accept subchannel content`)
                }

                if (type !== 'pdf') throw Error(`please indicate that type is pdf`)
            } catch (error) {
                throw new Error(error.message);
            }
        })()

    },

    /**
     * it adds content text nested to the subchannel that belong to a channnel 
     * 
     * @param {String} channel_id 
     * @param {String} subchannel_id 
     * @param {String} type 
     * @param {String} title 
     * @param {String} author 
     * @param {String} text_body 
     * 
     * @throws {Error} if the channel has not been found
     * @throws {Error} if the channel does not accept subchannels content
     * @throws {Error} if the subchannel has not been found
     * @throws {Error} the variable 'type' should be 'text' 
     */
    addSubchannelTextContent(channel_id, subchannel_id, type, title, author, text_body) {
        validate.arguments([
            { name: 'channel_id', value: channel_id, type: 'string', notEmpty: true },
            { name: 'subchannel_id', value: subchannel_id, type: 'string', notEmpty: true },
            { name: 'type', value: type, type: 'string', notEmpty: true },
            { name: 'title', value: title, type: 'string', notEmpty: true },
            { name: 'author', value: author, type: 'string', notEmpty: true },
            { name: 'text_body', value: text_body, type: 'string', notEmpty: true }
        ])

        return (async () => {
            try {
                if (type === 'text') {
                    const channel = await Channel.findById(channel_id)
                    if (!channel) throw Error(`No_channel_found`)

                    if (channel.has_subchannels) {
                        const index_subchannel = channel.subchannels.findIndex(element => element._id.toString() === subchannel_id)
                        if (index_subchannel === -1) throw Error(`No_subchannel_found`)

                        const text = new Text({ title, author, text_body })

                        const content_post = new Content({ type, text })

                        channel.subchannels[index_subchannel].content.push(content_post)

                        await channel.save()

                        return content_post
                    }
                    if (!channel.has_subchannels) throw Error(`channel does not accept subchannel content`)
                }

                if (type !== 'text') throw Error(`please indicate that type is text`)
            } catch (error) {
                throw new Error(error.message);
            }
        })()
    },

    /***********************************RATING***********************************************/

    /**
     * adding a rating value between 0-10 to the content that belong to channel without subchannels
     * 
     * @param {Number} rating_value 
     * @param {String} channel_id 
     * @param {String} content_id 
     * 
     * @throws {Error} the rating value must be between 0-10
     * @throws {Error} the channel has not been found
     * @throws {Error} if the channel has no subchannels
     * @throws {Error} the content has not been found
     */
    addRatingValueContentChannel(rating_value, channel_id, content_id) {
        validate.arguments([
            { name: 'rating_value', value: rating_value, type: 'number', notEmpty: true },
            { name: 'channel_id', value: channel_id, type: 'string', notEmpty: true },
            { name: 'content_id', value: content_id, type: 'string', notEmpty: true }
        ])

        return (async () => {
            try {
                if (rating_value < 0 || rating_value > 10) throw Error(`rating value must be between 0-10`)

                const channel = await Channel.findById(channel_id)
                if (!channel) throw Error(`No_channel_found`)

                if (channel.has_subchannels) throw Error(`Channel has no content, this channel containt subchannels`)

                const index_content = channel.content.findIndex(element => element._id.toString() === content_id)
                if (index_content === -1) throw Error(`No_content_found`)

                channel.content[index_content].rating.push(rating_value)
                return await channel.save()
            } catch (error) {
                throw new Error(error.message);
            }
        })()
    },

    /**
     * adding a rating value between 0-10 to the content that belong to a subchannels
     * 
     * @param {String} rating_value 
     * @param {String} channel_id 
     * @param {String} subchannel_id 
     * @param {String} content_id 
     * 
     * @throws {Error} the rating value must be between 0-10
     * @throws {Error} the channel has not been found
     * @throws {Error} the subchannel has not been found
     * @throws {Error} if the channel has no subchannels
     * @throws {Error} the content has not been found
     */
    addRatingValueContentSubchannel(rating_value, channel_id, subchannel_id, content_id) {
        validate.arguments([
            { name: 'rating_value', value: rating_value, type: 'number', notEmpty: true },
            { name: 'channel_id', value: channel_id, type: 'string', notEmpty: true },
            { name: 'subchannel_id', value: subchannel_id, type: 'string', notEmpty: true },
            { name: 'content_id', value: content_id, type: 'string', notEmpty: true }
        ])

        return (async () => {
            try {

                if (rating_value < 0 || rating_value > 10) throw Error('rating value must be between 0-10')

                const channel = await Channel.findById(channel_id)
                if (!channel) throw Error(`No_channel_found`)

                if (channel.has_subchannels) {

                    const index_subchannel = channel.subchannels.findIndex(element => element._id.toString() === subchannel_id)
                    if (index_subchannel === -1) throw Error('No_subchannel_found')

                    const index_content = channel.subchannels[index_subchannel].content.findIndex(element => element._id.toString() === content_id)
                    if (index_content === -1) throw Error('No_content_found')

                    channel.subchannels[index_subchannel].content[index_content].rating.push(rating_value)
                    return await channel.save()
                }
                if (!channel.has_subchannels) throw Error('There are no subchannels to evaluate')
            } catch (error) {
                throw new Error(error.message);
            }
        })()
    },

    /***********************************AVERAGE***********************************************/

    /**
     * Calculates the average channels that contain just contents, without subchannels
     * 
     * @throws {Error} if there are no channels without subchannels available
     * 
     */
    averageChannelsWithContent() {

        return (async () => {
            try {
                let sum = 0
                let avg_cont, avg_cha
                let average_contents = []
                let average_content_channel = []

                const channels = await Channel.find({ has_subchannels: false })
                if (!channels) throw Error(`No_channel_found`)

                channels.map(item => {
                    item.content.map(cont => {

                        console.log('cont.rating', cont.rating)
                        if (cont.rating.length != 0) {
                            sum = cont.rating.reduce((previous, current) => current += previous, 0)
                            avg_cont = sum / cont.rating.length
                        }
                        if (cont.rating.length == 0) avg_cont = 5

                        average_contents.push(avg_cont)
                    })

                    sum = 0
                    average_contents.map(x => {
                        console.log('average_contents', average_contents)
                        sum = sum + x
                        avg_cha = sum / average_contents.length
                    })

                    average_content_channel.push({
                        channel_title: item.title,
                        average_rating: avg_cha.toFixed(1)
                    })
                    average_contents = []
                })

                console.log('average_content_channel', average_content_channel)

                return average_content_channel

            } catch (error) {
                throw new Error(error.message);
            }
        })()
    },

    /**
     *     
     * Calculates the  channels average that contain content just inside subchannels
     * 
     * @throws {Error} if there are no channels without subchannels available
     * 
     */
    averageChannelsWithSubchannels() {

        return (async () => {
            try {
                let sum = 0
                let avg_cont, avg_sub, avg_cha
                let average_contents = []
                let average_content_subchannel = []
                let average_content_channel = []

                const channels = await Channel.find({ has_subchannels: true })
                if (!channels) throw Error(`No_channel_found`)

                channels.map(item => {

                    item.subchannels.map(subchannel => {

                        subchannel.content.map(cont => {

                            console.log('cont.rating', cont.rating)
                            if (cont.rating.length != 0) {
                                sum = cont.rating.reduce((previous, current) => current += previous, 0)
                                avg_cont = sum / cont.rating.length
                            }
                            if (cont.rating.length == 0) avg_cont = 5

                            average_contents.push(avg_cont)
                        })
                        sum = 0
                        average_contents.map(x => {
                            console.log('average_contents', average_contents)
                            sum = sum + x
                            avg_sub = sum / average_contents.length
                        })

                        average_content_subchannel.push(avg_sub)
                        average_contents = []
                    })

                    sum = 0
                    average_content_subchannel.map(x => {
                        console.log('average_content_subchannel', average_content_subchannel)
                        sum = sum + x
                        avg_cha = sum / average_content_subchannel.length
                    })

                    average_content_channel.push({
                        channel_title: item.title,
                        average_rating: avg_cha.toFixed(1)

                    })
                    average_content_subchannel = []

                })

                console.log('average_content_channel', average_content_channel)

                return average_content_channel

            } catch (error) {
                throw new Error(error.message);
            }
        })()
    },

    /**
     * Exports a csv file with the channels average ranking
     * 
     */
    listAverageAllChannels() {

        return (async () => {
            try {
                const channelsWithOnlyContent = await this.averageChannelsWithContent()

                const channelsWithOnlySubchannels = await this.averageChannelsWithSubchannels()

                const result = channelsWithOnlyContent.concat(channelsWithOnlySubchannels)

                function compare(a, b) {
                    if (a.average_rating > b.average_rating) {
                        return -1;
                    }
                    if (a.average_rating < b.average_rating) {
                        return 1;
                    }
                    return 0;
                }
                
                result.sort(compare)

                const csvFields = ['channel_title', 'average_rating']
                const json2csvParser = new Json2csvParser({ csvFields })
                const csv = json2csvParser.parse(result)
                
                console.log(csv)

                fs.writeFile('raking_channels_rating.csv', csv, function(err) {
                    if (err) throw (err);
                    console.log('file saved');
                });
                // -> Check 'customer.csv' file in root project folder             
            }
            catch (error) {
                throw new Error(error.message);
            }
        })()
    }
}

module.exports = logic