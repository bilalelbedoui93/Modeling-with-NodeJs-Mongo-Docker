const { Group, Channel, Subchannel, Content, Pdf, Video, Text } = require('../models')
const validate = require('../common/validate')

const logic = {

    /***********************************GROUP*********************************************/

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

                    return await channel.save()
                }

                if (type !== 'video') throw Error(`please indicate that type is video`)

            } catch (error) {
                throw new Error(error.message);
            }
        })()
    },

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

                    return await channel.save()
                }

                if (type !== 'pdf') throw Error(`please indicate that type is pdf`)
            } catch (error) {
                throw new Error(error.message);
            }
        })()

    },
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

                    return await channel.save()
                }

                if (type !== 'text') throw Error(`please indicate that type is text`)
            } catch (error) {
                throw new Error(error.message);
            }
        })()

    },

    /***********************************SUBCHANNELS*******************************************/

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

                    return await channel.save();
                }
                if (!channel.has_subchannels) throw Error(`no permission to add subchannels to this channel`)

            } catch (error) {
                throw new Error(error.message);
            }
        })()
    },

    /***********************************CONTENT-SUBCHANNELS*********************************************/

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

                        return await channel.save()
                    }
                    if (!channel.has_subchannels) throw Error(`channel does not accept subchannel content`)
                }

                if (type !== 'video') throw Error(`please indicate that type is video`)


            } catch (error) {
                throw new Error(error.message);
            }
        })()
    },

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
                    debugger
                    const channel = await Channel.findById(channel_id)
                    if (!channel) throw Error(`No_channel_found`)

                    if (channel.has_subchannels) {

                        const index_subchannel = channel.subchannels.findIndex(element => element._id.toString() === subchannel_id)
                        if (index_subchannel === -1) throw Error(`No_subchannel_found`)

                        const pdf = new Pdf({ title, author, description, file_url })

                        const content_post = new Content({ type, pdf })

                        channel.subchannels[index_subchannel].content.push(content_post)

                        return await channel.save()
                    }

                    if (!channel.has_subchannels) throw Error(`channel does not accept subchannel content`)
                }

                if (type !== 'pdf') throw Error(`please indicate that type is pdf`)
            } catch (error) {
                throw new Error(error.message);
            }
        })()

    },

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

                        return await channel.save()
                    }
                    if (!channel.has_subchannels) throw Error(`channel does not accept subchannel content`)
                }

                if (type !== 'text') throw Error(`please indicate that type is text`)
            } catch (error) {
                throw new Error(error.message);
            }
        })()
    },

    /***********************************RATING*********************************************/

    addRatingValueContentChannel(rating_value, channel_id, content_id) {
        validate.arguments([
            { name: 'rating_value', value: rating_value, type: 'number', notEmpty: true },
            { name: 'channel_id', value: channel_id, type: 'string', notEmpty: true },
            { name: 'content_id', value: content_id, type: 'string', notEmpty: true }
        ])

        return (async () => {
            try {
                if (rating_value <= 0 || rating_value >= 10) throw Error(`rating value must be between 0-10`)

                const channel = await Channel.findById(channel_id)
                if (!channel) throw Error(`No_channel_found`)

                if (channel.has_subchannels) throw Error(`This channel has no content`)

                const index_content = channel.content.findIndex(element => element._id.toString() === content_id)
                if (index_content === -1) throw Error(`No_content_found`)

                channel.content[index_content].rating.push(rating_value)
                return await channel.save()
            } catch (error) {
                throw new Error(error.message);
            }
        })()
    },
    addRatingValueContentSubchannel(rating_value, channel_id, subchannel_id, content_id) {
        validate.arguments([
            { name: 'rating_value', value: rating_value, type: 'number', notEmpty: true },
            { name: 'channel_id', value: channel_id, type: 'string', notEmpty: true },
            { name: 'subchannel_id', value: subchannel_id, type: 'string', notEmpty: true },
            { name: 'content_id', value: content_id, type: 'string', notEmpty: true }
        ])

        return (async () => {
            try {
                
                if (rating_value <= 0 || rating_value >= 10) throw Error(`rating value must be between 0-10`)

                const channel = await Channel.findById(channel_id)
                if (!channel) throw Error(`No_channel_found`)

                if (channel.has_subchannels) {

                    const index_subchannel = channel.subchannels.findIndex(element => element._id.toString() === subchannel_id)
                    if (index_subchannel === -1) throw Error(`No_subchannel_found`)

                    const index_content = channel.subchannels[index_subchannel].content.findIndex(element => element._id.toString() === content_id)
                    if (index_content === -1) throw Error(`No_content_found`)

                    channel.subchannels[index_subchannel].content[index_content].rating.push(rating_value)
                    return await channel.save()
                }
                if (!channel.has_subchannels) throw Error(`channel does not accept subchannel rating`)
            } catch (error) {
                throw new Error(error.message);
            }
        })()
    }
}

module.exports = logic