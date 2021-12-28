import ActivitiesModel from '../models/Activities'

/**
 * Event Lists
 * 1. POSTED
 * 2. COMMENTED
 * 3. VOTED
 * 4. QUOTED
 */

export const logActivity = async (event, ids, content) => {
    const newActivity = {
        event,
        ids,
        content,
        created: new Date()
    }
    await new ActivitiesModel(newActivity).save()
}