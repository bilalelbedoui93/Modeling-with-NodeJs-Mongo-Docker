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
                throw new Error(error);
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

                const channels = await Channel.find({ group: id })

                return { group, channels }

            } catch (error) {
                throw new Error(error.message);
            }
        })()
    }

    /***********************************CHANNEL*********************************************/

}

module.exports = logic