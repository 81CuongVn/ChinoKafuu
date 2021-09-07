module.exports = class Collection {
  constructor (model) {
    this.model = model
  }

  /**
     *
     * @param id
     * @returns {*}
     */
  findOneByID (id) {
    return this.findOne({ id })
  }

  /**
     *
     * @param args
     */
  findOne (...args) {
    return this.model.findOne(...args)
  }

  /**
     *
     * @param id
     * @returns {Promise<Promise|void|*>}
     */
  async getAndDelete (id) {
    const ms = Date.now()
    const data = await this.findOneByID(id)
    data.ms = ms
    if (data) {

      return this.model.findOneAndDelete({ id })
    } else {
      return undefined
    }
  }

  /**
     *
     * @param id
     * @param defaultValues
     * @returns {Promise<Promise|void|*>}
     */
  async getOrCreate (id, defaultValues = {}) {
    const ms = Date.now()
    const data = await this.findOneByID(id)
    data.ms = ms
    if (!data) {

      return this.model({ id, ...defaultValues }).save()
    }
    return data
  }
}
