"""csvFilter

Filters out unneccsary rows from large csv files.
"""


import csv
import sys, os


def filtercsv(path, filterfunc):
    directory = os.path.dirname(path)
    filename = os.path.basename(path)
    outpath = os.path.join(directory, "FILTERED_" + filename)
    with open(path,'r') as fin, open(outpath,'w', newline='') as fout:
        reader = csv.DictReader(fin, delimiter=',')
        writer = csv.DictWriter(fout, fieldnames=reader.fieldnames, delimiter=',')            
        writer.writeheader()
        for row in reader:
            if filterfunc(row):
                 writer.writerow(row)


def main():
    path = sys.argv[1]
    filter = lambda row : row['age_group_id'] == "38" and row['metric'] == "obese"
    filtercsv(path, filter)

if __name__ == '__main__':
	main()