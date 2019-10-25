const logic = require('.')
const { expect } = require('chai')
const { Group, Channel, Subchannel, Content, Pdf, Video, Text } = require('../models')
const mongoose = require("mongoose")


describe('LOGIC', () => {
    before(async () => {
        await mongoose.connect("mongodb://localhost/immfly_project_test", {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });
    })

    describe('Channel rating algorithm', () => {
        let name_group, description, title_chan, title_sub, language, picture
        let title_content, author, movie_director, genre, file_url
        let rating_value_1, rating_value_2, rating_value_3

        let group
        let channel_1, channel_2

        let content_video_1, content_pdf_1, content_text_1
        let content_video_2, content_pdf_2, content_text_2

        let channel_with_subchannels_1, channel_with_subchannels_2
        let subchannel_1, subchannel_2, subchannel_3, subchannel_4

        let content_video_sub1, content_pdf_sub1, content_text_sub1
        let content_video_sub2, content_pdf_sub2, content_text_sub2
        let content_video_sub3, content_pdf_sub3, content_text_sub3
        let content_video_sub4, content_pdf_sub4, content_text_sub4

        beforeEach(async () => {

            await Group.deleteMany()
            await Channel.deleteMany()

            name_group = `entertainment-${Math.floor(Math.random() * (1000 - 1)) + 1}-group`
            description = `programs for -${Math.floor(Math.random() * (1000 - 1)) + 1} ...`
            title_chan = `antena-${Math.floor(Math.random() * (1000 - 1)) + 1}`
            title_sub = `antena-subchannel-${Math.floor(Math.random() * (1000 - 1)) + 1}`
            language = `french-${Math.floor(Math.random() * (1000 - 1)) + 1}`
            picture = `www.fake-${Math.floor(Math.random() * (1000 - 1)) + 1}.com`
            title_content = `antena-${Math.floor(Math.random() * (1000 - 1)) + 1}`
            author = `alberto-${Math.floor(Math.random() * (1000 - 1)) + 1} fernandez`
            movie_director = `Spielberg-${Math.floor(Math.random() * (1000 - 1)) + 1}`
            genre = `romance-${Math.floor(Math.random() * (1000 - 1)) + 1}`
            file_url = `www.fake-${Math.floor(Math.random() * (1000 - 1)) + 1}.com`
            rating_value_1 = Math.floor(Math.random() * (10 - 1)) + 1
            rating_value_2 = Math.floor(Math.random() * (10 - 1)) + 1
            rating_value_3 = Math.floor(Math.random() * (10 - 1)) + 1

            // adding a group                                                                                                                 
            group = await logic.addGroup(name_group, description)

            // adding two channels without subchannels
            channel_1 = await logic.addChannel([group._id], title_chan, language, picture, has_subchannels = false)
            channel_2 = await logic.addChannel([group._id], title_chan, language, picture, has_subchannels = false)

            // adding different content to channel_1 without content
            content_video_1 = await logic.addVideoContent(channel_1.id, type = 'video', title_content, author, movie_director, genre, description, file_url)
            content_pdf_1 = await logic.addPdfContent(channel_1.id, type = 'pdf', title_content, author, description, file_url)
            content_text_1 = await logic.addTextContent(channel_1.id, type = 'text', title_content, author, description)

            // adding different content to channel_2 without content
            content_video_2 = await logic.addVideoContent(channel_2.id, type = 'video', title_content, author, movie_director, genre, description, file_url)
            content_pdf_2 = await logic.addPdfContent(channel_2.id, type = 'pdf', title_content, author, description, file_url)
            content_text_2 = await logic.addTextContent(channel_2.id, type = 'text', title_content, author, description)

            // adding rating values to the content that belongs to the channel 1
            await logic.addRatingValueContentChannel(rating_value_1, channel_1.id, content_video_1.id)
            await logic.addRatingValueContentChannel(rating_value_2, channel_1.id, content_pdf_1.id)
            await logic.addRatingValueContentChannel(rating_value_3, channel_1.id, content_text_1.id)

            // adding rating values to the content that belongs to the channel 2
            await logic.addRatingValueContentChannel(rating_value_1, channel_2.id, content_video_2.id)
            await logic.addRatingValueContentChannel(rating_value_2, channel_2.id, content_pdf_2.id)
            await logic.addRatingValueContentChannel(rating_value_3, channel_2.id, content_text_2.id)

            // adding two channels with subchannels
            channel_with_subchannels_1 = await logic.addChannel([group._id], title_chan, language, picture, has_subchannels = true)
            channel_with_subchannels_2 = await logic.addChannel([group._id], title_chan, language, picture, has_subchannels = true)

            //adding two subchannels to channel_with_subchannels_1
            subchannel_1 = await logic.addSubchannels(channel_with_subchannels_1.id, title_sub, language, picture)
            subchannel_2 = await logic.addSubchannels(channel_with_subchannels_1.id, title_sub, language, picture)

            //adding two subchannels to channel_with_subchannels_2
            subchannel_3 = await logic.addSubchannels(channel_with_subchannels_2.id, title_sub, language, picture)
            subchannel_4 = await logic.addSubchannels(channel_with_subchannels_2.id, title_sub, language, picture)

            //adding content to the subchannel_1 that belongs to the channel 1
            content_video_sub1 = await logic.addSubchannelVideoContent(channel_with_subchannels_1.id, subchannel_1.id, type = 'video', title_content, author, movie_director, genre, description, file_url)
            content_pdf_sub1 = await logic.addSubchannelPdfContent(channel_with_subchannels_1.id, subchannel_1.id, type = 'pdf', title_content, author, description, file_url)
            content_text_sub1 = await logic.addSubchannelTextContent(channel_with_subchannels_1.id, subchannel_1.id, type = 'text', title_content, author, description)

            //adding content to the subchannel_2 that belongs to the channel 1
            content_video_sub2 = await logic.addSubchannelVideoContent(channel_with_subchannels_1.id, subchannel_2.id, type = 'video', title_content, author, movie_director, genre, description, file_url)
            content_pdf_sub2 = await logic.addSubchannelPdfContent(channel_with_subchannels_1.id, subchannel_2.id, type = 'pdf', title_content, author, description, file_url)
            content_text_sub2 = await logic.addSubchannelTextContent(channel_with_subchannels_1.id, subchannel_2.id, type = 'text', title_content, author, description)

            //adding content to the subchannel_3 that belongs to the channel 2
            content_video_sub3 = await logic.addSubchannelVideoContent(channel_with_subchannels_2.id, subchannel_3.id, type = 'video', title_content, author, movie_director, genre, description, file_url)
            content_pdf_sub3 = await logic.addSubchannelPdfContent(channel_with_subchannels_2.id, subchannel_3.id, type = 'pdf', title_content, author, description, file_url)
            content_text_sub3 = await logic.addSubchannelTextContent(channel_with_subchannels_2.id, subchannel_3.id, type = 'text', title_content, author, description)

            //adding content to the subchannel_4 that belongs to the channel 2
            content_video_sub4 = await logic.addSubchannelVideoContent(channel_with_subchannels_2.id, subchannel_4.id, type = 'video', title_content, author, movie_director, genre, description, file_url)
            content_pdf_sub4 = await logic.addSubchannelPdfContent(channel_with_subchannels_2.id, subchannel_4.id, type = 'pdf', title_content, author, description, file_url)
            content_text_sub4 = await logic.addSubchannelTextContent(channel_with_subchannels_2.id, subchannel_4.id, type = 'text', title_content, author, description)

            // adding rating values to the content that belongs to the subchannel 1
            await logic.addRatingValueContentSubchannel(rating_value_1, channel_with_subchannels_1.id, subchannel_1.id, content_video_sub1.id)
            await logic.addRatingValueContentSubchannel(rating_value_2, channel_with_subchannels_1.id, subchannel_1.id, content_pdf_sub1.id)
            await logic.addRatingValueContentSubchannel(rating_value_3, channel_with_subchannels_1.id, subchannel_1.id, content_text_sub1.id)

            // adding rating values to the content that belongs to the subchannel 2
            await logic.addRatingValueContentSubchannel(rating_value_1, channel_with_subchannels_1.id, subchannel_2.id, content_video_sub2.id)
            await logic.addRatingValueContentSubchannel(rating_value_2, channel_with_subchannels_1.id, subchannel_2.id, content_pdf_sub2.id)
            await logic.addRatingValueContentSubchannel(rating_value_3, channel_with_subchannels_1.id, subchannel_2.id, content_text_sub2.id)

            // adding rating values to the content that belongs to the subchannel 3
            await logic.addRatingValueContentSubchannel(rating_value_1, channel_with_subchannels_2.id, subchannel_3.id, content_video_sub3.id)
            await logic.addRatingValueContentSubchannel(rating_value_2, channel_with_subchannels_2.id, subchannel_3.id, content_pdf_sub3.id)
            await logic.addRatingValueContentSubchannel(rating_value_3, channel_with_subchannels_2.id, subchannel_3.id, content_text_sub3.id)

            // adding rating values to the content that belongs to the subchannel 4
            await logic.addRatingValueContentSubchannel(rating_value_1, channel_with_subchannels_2.id, subchannel_4.id, content_video_sub4.id)
            await logic.addRatingValueContentSubchannel(rating_value_2, channel_with_subchannels_2.id, subchannel_4.id, content_pdf_sub4.id)
            await logic.addRatingValueContentSubchannel(rating_value_3, channel_with_subchannels_2.id, subchannel_4.id, content_text_sub4.id)

        })

        describe('GROUPS', () =>{
            
            let groupCreated 

            beforeEach(async () => {

                groupCreated = await Group.findById(group.id)

            })

            it('should check that the group has been created', async () => {

                expect(groupCreated).to.exist  
                expect(groupCreated).to.be.an('object')    
                expect(groupCreated.id).to.equal(group.id)
                expect(groupCreated.name).to.equal(name_group)
                expect(groupCreated.description).to.equal(description)

            })
        })

        describe('CHANNELS', () =>{
            
            let channelWithContent, channelWithSubchannel

            beforeEach(async () => {

                channelWithContent = await Channel.findById(channel_1.id)
                channelWithSubchannel = await Channel.findById(channel_with_subchannels_1.id)

            })

            it('should check that a channel that must contain just content has been created', async () => {
                expect(channelWithContent).to.exist  
                expect(channelWithContent).to.be.an('object')    
                expect(channelWithContent.id).to.equal(channel_1.id)
                expect(channelWithContent.title).to.equal(title_chan)
                expect(channelWithContent.language).to.equal(language)
                expect(channelWithContent.picture).to.equal(picture)
                expect(channelWithContent.has_subchannels).to.be.false
            })

            it('should check that a channel with subchannels has been created', async () => {
                expect(channelWithSubchannel).to.exist  
                expect(channelWithSubchannel).to.be.an('object')    
                expect(channelWithSubchannel.id).to.equal(channel_with_subchannels_1.id)
                expect(channelWithSubchannel.title).to.equal(title_chan)
                expect(channelWithSubchannel.language).to.equal(language)
                expect(channelWithSubchannel.picture).to.equal(picture)
                expect(channelWithSubchannel.has_subchannels).to.be.true
            })

            it('Should check that the channel belongs to the group created', async () => {

                expect(channelWithContent.groups[0].toString()).to.equal(group.id) 

            })

            describe('CONTENT ==> CHANNEL', () =>{
                
                it('should check that a video content has been created', async () => {
                    expect(channelWithContent.content[0].type).to.equal('video')  
                    expect(channelWithContent.content[0].video).to.be.an('object')    
                    expect(channelWithContent.content[0].id).to.equal(content_video_1.id)
                })

                it('should check that a pdf content has been created', async () => {
                    expect(channelWithContent.content[1].type).to.equal('pdf')  
                    expect(channelWithContent.content[1].pdf).to.be.an('object')    
                    expect(channelWithContent.content[1].id).to.equal(content_pdf_1.id)
                })

                it('should check that a text content has been created', async () => {
                    expect(channelWithContent.content[2].type).to.equal('text')  
                    expect(channelWithContent.content[2].text).to.be.an('object')    
                    expect(channelWithContent.content[2].id).to.equal(content_text_1.id)
                })
            })

            describe('SUBCHANNELS', () =>{
                
                it('should check that the subchannels have been created', async () => {
                    expect(channelWithSubchannel.subchannels).to.have.lengthOf(2)  
                    expect(channelWithSubchannel.subchannels[0].id).to.equal(subchannel_1.id)
                    expect(channelWithSubchannel.subchannels[0].title).to.equal(title_sub)
                    expect(channelWithSubchannel.subchannels[0].language).to.equal(language)
                    expect(channelWithSubchannel.subchannels[0].picture).to.equal(picture)
                })

                describe('CONTENT ==> SUBCHANNEL', () =>{
                
                    it('should check that a video content has been created in a subchannel', async () => {
                        expect(channelWithSubchannel.subchannels[0].content[0].type).to.equal('video')  
                        expect(channelWithSubchannel.subchannels[0].content[0].video).to.be.an('object')    
                        expect(channelWithSubchannel.subchannels[0].content[0].id).to.equal(content_video_sub1.id) 
                    })
    
                    it('should check that a pdf content has been created in a subchannel', async () => {
                        expect(channelWithSubchannel.subchannels[0].content[1].type).to.equal('pdf')  
                        expect(channelWithSubchannel.subchannels[0].content[1].pdf).to.be.an('object')    
                        expect(channelWithSubchannel.subchannels[0].content[1].id).to.equal(content_pdf_sub1.id)
                    })
    
                    it('should check that a text content has been created in a subchannel', async () => {
                        expect(channelWithSubchannel.subchannels[0].content[2].type).to.equal('text')  
                        expect(channelWithSubchannel.subchannels[0].content[2].text).to.be.an('object')    
                        expect(channelWithSubchannel.subchannels[0].content[2].id).to.equal(content_text_sub1.id)
                    })
                })

            })
        })

        describe('RATING CONTENT CHANNELS WITH JUST CONTENT', () => {

            let ChannelsWithJustContent = []

            beforeEach(async () => {

                ChannelsWithJustContent = await Channel.find({ has_subchannels: false })

            })

            it('the rating array of each content should have length', async () => {
                ChannelsWithJustContent.map(channel => {
                    channel.content.map(item => {
                        expect(item.rating).to.be.an('array')
                        expect(item.rating).have.lengthOf(1)
                    })
                })
            })

            it('the video content of each channel should have the rating_value_1', async () => {
                ChannelsWithJustContent.map(channel => {
                    if (channel.content.type === 'video') {

                        channel.content.map(item => {
                            expect(item.rating).to.equal(rating_value_1)
                        })
                    }
                })
            })

            it('the pdf content of each channel should have the rating_value_2', async () => {
                ChannelsWithJustContent.map(channel => {
                    if (channel.content.type === 'pdf') {
                        channel.content.map(item => {
                            expect(item.rating).to.equal(rating_value_2)
                        })
                    }
                })
            })

            it('the text content of each channel should have the rating_value_3', async () => {
                ChannelsWithJustContent.map(channel => {
                    if (channel.content.type === 'text') {
                        channel.content.map(item => {
                            expect(item.rating).to.equal(rating_value_3)
                        })
                    }
                })
            })

            it('should fail if the rating value is not a number', async () => {
                try {
                    await logic.addRatingValueContentChannel(rating_value_1 = 'a', channel_1.id, content_video_1.id)
                } catch (error) {
                    expect(error.message).to.equal('rating_value a is not a number')
                }
            })

            it('should fail if the rating value is not between 0-10', async () => {
                try {
                    await logic.addRatingValueContentChannel(rating_value_1 = 11, channel_1.id, content_video_1.id)
                } catch (error) {
                    expect(error.message).to.equal('rating value must be between 0-10')
                }
            })

            it('should fail if the channel has not been found', async () => {
                try {
                    await logic.addRatingValueContentChannel(rating_value_1, content_video_1.id, channel_1.id)
                } catch (error) {
                    expect(error.message).to.equal('No_channel_found')
                }
            })

            it('should fail if you are trying to evaluate a channel with subchannels', async () => {
                try {
                    await logic.addRatingValueContentChannel(rating_value_1, channel_with_subchannels_1.id, content_video_1.id)
                } catch (error) {
                    expect(error.message).to.equal('Channel has no content, this channel containt subchannels')
                }
            })

            it('should fail if the content does not exist', async () => {
                try {
                    await logic.addRatingValueContentChannel(rating_value_1, channel_1.id, content_video_2.id)
                } catch (error) {
                    expect(error.message).to.equal('No_content_found')
                }
            })
        })

        describe('RATING CONTENT CHANNELS WITH SUBCHANNELS', () => {

            let ChannelsWithSubchannels = []

            beforeEach(async () => {

                ChannelsWithSubchannels = await Channel.find({ has_subchannels: true })

            })
            it('the rating array of each content should have length', async () => {
                ChannelsWithSubchannels.map(channel => {
                    channel.subchannels.map(subchannel => {
                        subchannel.content.map(item => {
                            expect(item.rating).to.be.an('array')
                            expect(item.rating).have.lengthOf(1)
                        })
                    })
                })
            })

            it('the video content of each subchannel should have the rating_value_1', async () => {
                ChannelsWithSubchannels.map(channel => {
                    channel.subchannels.map(subchannel => {
                        if (channel.content.type === 'video') {
                            subchannel.content.map(item => {
                                expect(item.rating).to.equal(rating_value_1)
                            })
                        }
                    })
                })
            })

            it('the pdf content of each subchannel should have the rating_value_2', async () => {
                ChannelsWithSubchannels.map(channel => {
                    channel.subchannels.map(subchannel => {
                        if (channel.content.type === 'pdf') {
                            subchannel.content.map(item => {
                                expect(item.rating).to.equal(rating_value_2)
                            })
                        }
                    })
                })
            })

            it('the text content of each subchannel should have the rating_value_3', async () => {
                ChannelsWithSubchannels.map(channel => {
                    channel.subchannels.map(subchannel => {
                        if (channel.content.type === 'text') {
                            subchannel.content.map(item => {
                                expect(item.rating).to.equal(rating_value_3)
                            })
                        }
                    })
                })
            })

            it('should fail if the rating value is not a number', async () => {
                try {
                    await logic.addRatingValueContentSubchannel(rating_value_3 = 'b', channel_with_subchannels_2.id, subchannel_4.id, content_text_sub4.id)
                } catch (error) {
                    expect(error.message).to.equal('rating_value b is not a number')
                }
            })

            it('should fail if the rating value is not between 0-10', async () => {
                try {
                    await logic.addRatingValueContentSubchannel(rating_value_3 = -2, channel_with_subchannels_2.id, subchannel_4.id, content_text_sub4.id)
                } catch (error) {
                    expect(error.message).to.equal('rating value must be between 0-10')
                }
            })

            it('should fail if the channel has not been found', async () => {
                try {
                    await logic.addRatingValueContentSubchannel(rating_value_3 , content_text_sub4.id, subchannel_4.id, content_text_sub4.id)
                } catch (error) {
                    expect(error.message).to.equal('No_channel_found')
                }
            })
            
            it('should fail if you are trying to evaluate a channel with just content, without subchannels', async () => {
                try {
                    await logic.addRatingValueContentSubchannel(rating_value_3 , channel_1.id, subchannel_4.id, content_text_sub4.id)
                } catch (error) {
                    expect(error.message).to.equal('There are no subchannels to evaluate')
                }
            })

            it('should fail if the content does not exist', async () => {
                try {
                    await logic.addRatingValueContentSubchannel(rating_value_3, channel_with_subchannels_2.id, subchannel_1.id, content_text_sub4.id)
                } catch (error) {
                    expect(error.message).to.equal('No_subchannel_found')
                }
            })

            it('should fail if the content does not exist', async () => {
                try {
                    await logic.addRatingValueContentSubchannel(rating_value_3, channel_with_subchannels_2.id, subchannel_4.id, content_text_sub1.id)
                } catch (error) {
                    expect(error.message).to.equal('No_content_found')
                }
            })
        })
    })

    after(async () => mongoose.disconnect(true))

})