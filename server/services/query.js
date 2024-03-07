function getPagination(params){
    const limit = Math.abs(params.limit) || 10
    const page = Math.abs(params.page) || 1
    const skip = (page -1)* limit 
    return {
        skip,
        limit,
        page
    }
}

module.exports = {getPagination}