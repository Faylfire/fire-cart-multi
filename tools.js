export default function validateInput(input) {
    // Trim whitespace from the beginning and end of the input
    input = input.trim();

    // Check if the input is empty after trimming
    if (input.length === 0) {
        return { isValid: false, message: "Cannot be empty" };
    }

    // Check if the input is too long (e.g., more than 200 characters)
    if (input.length > 72) {
        return { isValid: false, message: "Entry is too long: Maximum 72 characters allowed." };
    }

    // Regular expression to allow only letters, numbers, spaces, and basic punctuation
    //const validPattern = /^[a-zA-Z0-9\s.,!?()-]+$/;
    const invalidPattern = /[<>&"'`=()[\]{};\\]/;

    if (invalidPattern.test(input)) {
        return { isValid: false, message: "Invalid characters: '<>&\"'\`=()[]{};' are not allowed." };
    }

    // If all checks pass, the input is valid
    return { isValid: true, sanitizedInput: input };
}
