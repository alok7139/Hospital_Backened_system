export const catchasyncerror = (val) => {
    return (req,res,next) => {
        Promise.resolve(val(req,res,next))
               .catch(next);
    }
}