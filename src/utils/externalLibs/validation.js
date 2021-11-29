import joi from 'joi';

function signUp(newSignUp) {
    const schema = joi.object({
        name: joi.string().pattern(/^[A-Z0-9a-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/).min(3).max(20)
            .required(),
        email: joi.string().email().required(),
        password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required(),
        image: joi.string().pattern(/(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/).required(),
    });

    return !(schema.validate(newSignUp)).error;
}

function signIn(newSignIn) {
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).required(),
    });
    return !(schema.validate(newSignIn)).error;
}

function newHabit(habit) {
    const schema = joi.object({
        name: joi.string().pattern(/^[A-Z0-9a-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/).min(3).max(40)
            .required(),
        days: joi.array().items(joi.number().required().min(0).max(6)).min(1).required(),
    });
    return !(schema.validate(habit)).error;
}

function token(uuid) {
    const schema = joi.string().guid({
        version: [
            'uuidv4',
        ],
    });
    return !(schema.validate(uuid)).error;
}

export {
    signUp,
    signIn,
    newHabit,
    token,
};
