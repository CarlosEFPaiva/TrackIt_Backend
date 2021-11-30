function capitalizeFirstLetters(name) {
    if (!name) {
        return undefined;
    }
    const arrayOfWords = name.split(' ');
    const capitalizedArray = arrayOfWords.map((word) => {
        const lowerCaseWord = word.toLowerCase();
        return lowerCaseWord[0].toUpperCase() + lowerCaseWord.substring(1);
    });
    return capitalizedArray.join(' ');
}

function wasHabitCreatedToday(habit) {
    const today = new Date();
    const createdDate = habit.creationDate;
    return createdDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
}

export {
    capitalizeFirstLetters,
    wasHabitCreatedToday,
};
