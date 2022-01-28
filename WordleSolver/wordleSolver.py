from curses.ascii import isalpha
import os

# Loads words from dictionary file, filters out anything but 5 letter words and returns filtered dictionary
def load_words() -> list:
    with open('wordle.txt') as word_file:
        valid_words = set(word_file.read().split())
        print("Opened File...")
        five_letter_words = filter(letter5, valid_words)
        print("Filtered Words...")
    return five_letter_words

# Checks if the string passed to it is 5 letters long, returns Booleans
def letter5(w: str) -> bool:
    return len(w) == 5

# Checks if letters guessed are included in word passed in, if yes return false
def check_grey(letters: str, word: str) -> bool:
    for letter in letters: 
        if word.find(letter) >= 0:
            return False
    return True

# Gets guesses from the player, validates using validate_guess and returns string of guess 
def get_grey() -> list:
    guess = input("Enter greys: ")
    return list(guess)        
        
def check_yellow(letters: list, word: str) -> bool:
    for x in range(len(letters)):
        for y in range(len(letters[x])):
            if letters[x][y] == word[x]:
                return False
            if word.find(letters[x][y]) == -1:
                return False
    return True

def get_yellow(current: list) -> list:
    guess = five_letter_guess("Yellows")
    for x in range(len(guess)):
        if not guess[x] == " ":
            current[x] += guess[x]
    return current
    
def five_letter_guess(name: str) -> str:
    while True:
        user_guess = input("Enter " + name + ": ")
        if len(user_guess) == 5:
            return user_guess
        if user_guess == "":
            return "     "

# prints all possible answers from results file passed to console
def print_answers(results: list, count:int =50):
    if len(results) <= count:
        count = len(results)
    for answer in range(count):
        print(results[answer])

# collects user input for green letters, need to be either empty or 5 characters long 
# returns the either added or current known characters for green  
def get_greens(current: list) -> list:
    new_guess = current
    user_guess = five_letter_guess("greens")
    
    for x in range(len(current)):
        new_guess[x] = " "
        if current[x].isalpha():
            new_guess[x] = current[x]
        if user_guess[x].isalpha():
            new_guess[x] = user_guess[x]
    return new_guess

def check_greens(letters: list, word: str) -> bool:
    for x in range(len(word)):
        if not letters[x] == " ":
            if not letters[x] == word[x]:
                return False
    return True

def remove_duplicate(grey_letters: list, yellow_letters: list, green_letters: list) -> list:
    for x in green_letters:
        while grey_letters.count(x) > 0:
            grey_letters.remove(x)
        
    for x in range(len(yellow_letters)):
        for y in range(len(yellow_letters[x])):
            while grey_letters.count(yellow_letters[x][y]) > 0:
                grey_letters.remove(yellow_letters[x][y])
                    
    return grey_letters

def tabulate_letters(grey: list, yellow: list, green: list):
    all_letters = grey
    for x in range(len(yellow)):
        for y in range(len(yellow[x])):
            all_letters += yellow[x][y]
    all_letters += green
    return all_letters

if __name__ == '__main__':
    os.system('cls||clear')
    valid_5_words = list(load_words())
    print("5 letter words: " + str(len(valid_5_words)))

    num_guesses = 6
    all_letters = []
    wrong_letters = []
    yellow_letters = [[],[],[],[],[]]
    correct_letters = [" "," "," "," "," "]
    result = valid_5_words

    while num_guesses > 0:
        print("Words Left:" + str(len(result)))
        result = valid_5_words

        wrong_letters += get_grey()
        yellow_letters = get_yellow(yellow_letters)
        correct_letters = get_greens(correct_letters)

        all_letters = tabulate_letters(wrong_letters, yellow_letters, correct_letters)
        wrong_letters = remove_duplicate(wrong_letters, yellow_letters, correct_letters)

        result = list(filter(lambda word: check_greens(correct_letters, word), result))
        result = list(filter(lambda word: check_yellow(yellow_letters, word), result))
        result = list(filter(lambda word: check_grey(wrong_letters, word), result))

        ncl = list(filter(lambda word: check_grey(all_letters, word), valid_5_words))
        
        if len(result) == 1:
            num_guesses = 0
            os.system('cls||clear')
            print("word is " + result[0])
            exit()
        
        print_answers(result, 25)
        print("Uncommon word: ", ncl[0])   
        num_guesses -= 1