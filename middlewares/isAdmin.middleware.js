const role = (roleValue) => {
    return (req, res, next) => {
        try {
            // console.log(req.user)
            const role = req.user.role;

            if(role !== roleValue) {
                // return;
                return res.status(400).json({ message: 'Not authorized' })
            }
            next();
        } catch (error) {
            return res.status(500).json({ message: err.message })
        }
    }   
}

module.exports = role;