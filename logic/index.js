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

    addChannel(group_Ids, title, language, picture, has_subchannels, subchannels, content) {


        return (async () => {
            try {
                const groups = []

                const promises = group_Ids.map(async (element) => {
                    const group = await Group.findById(element)
                    if (!group) throw Error(`No_group_found`)

                    groups.push(group)
                })

                await Promise.all(promises);

                const channel = new Channel({
                    groups,
                    title,
                    language,
                    picture,
                    has_subchannels,
                    subchannels,
                    content
                })
                return await channel.save();
            } catch (error) {
                throw new Error(error.message);
            }
        })()

    }
}

module.exports = logic