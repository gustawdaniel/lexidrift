# Define the input file paths for Spanish and German
es_file_path = "es-raw.txt"
de_file_path = "de-raw.txt"

# Define a function to process the file contents
def process_file(file_path):
    # Read the file contents
    with open(file_path, "r") as file:
        input_string = file.read().strip()

    output = []

    # Split the input string by spaces
    words = input_string.split()

    # Iterate through the list of words and number pairs
    for i in range(0, len(words), 2):
        output.append(f"{words[i+1]} {words[i]}" if words[i].isdigit() else f"{words[i]} {words[i+1]}")

    # Join the output with newlines
    return "\n".join(output)

# Process both files and get the output
es_output_string = process_file(es_file_path)
de_output_string = process_file(de_file_path)

# Print the results for both files
print("Spanish Output:")
print(es_output_string)
print("\nGerman Output:")
print(de_output_string)

# Optional: Write the output to new files
with open("words/es.txt", "w") as es_output_file:
    es_output_file.write(es_output_string)

with open("words/de.txt", "w") as de_output_file:
    de_output_file.write(de_output_string)