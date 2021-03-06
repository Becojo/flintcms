const { GraphQLNonNull } = require('graphql')
const mongoose = require('mongoose')
const { inputType, outputType } = require('../../types/Entries')
const h = require('../../../utils/helpers')

const Entry = mongoose.model('Entry')
const Section = mongoose.model('Section')

module.exports = {
  type: new GraphQLNonNull(outputType),
  args: {
    data: {
      name: 'data',
      type: new GraphQLNonNull(inputType)
    }
  },
  async resolve ({ events, perms, socketEvent }, args) {
    // Ensure that the user can add new entries
    if (!perms.entries.canAddEntries) throw new Error('You do not have permission to create new Entries')

    // Ensure that the user is attempting and allowed to create a live entry
    if (args.data.status === 'live' && !perms.entries.canEditLive) {
      throw new Error('You do not have permission to create a live Entry. Change the status to "Draft".')
    }

    // Check that the section exists
    if (!await Section.findById(args.data.section)) throw new Error('That section does not exist.')

    // Check to see that there isn't already an entry with the slug
    const slug = h.slugify(args.data.title)
    if (await Entry.findOne({ slug })) throw new Error('There is already an entry with that slug.')

    // Format fields in the entry
    const data = await h.reduceToObj(args.data.fields, 'handle', 'value', args.data)

    // Create new Entry document
    const newEntry = new Entry(data)

    // Populate the author field for a better response to the client
    await Entry.populate(newEntry, { path: 'author' })

    // Emit new-entry event
    events.emit('pre-new-entry', newEntry)

    // Save the new entry
    const savedEntry = await newEntry.save()

    /* istanbul ignore if */
    if (!savedEntry) throw new Error('Error adding new entry')

    events.emit('post-new-entry', savedEntry)
    socketEvent('new-entry', savedEntry)
    return savedEntry
  }
}
