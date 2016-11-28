"""csvFilter

Filters out unneccsary rows from large csv files.
"""


import csv, itertools
import sys, os


def sortcsv(path, sortkey):
    directory = os.path.dirname(path)
    filename = os.path.basename(path)
    outpath = os.path.join(directory, "SORTED_" + filename)
    
    with open(path,'r') as fin, open(outpath,'w', newline='') as fout:
        reader = csv.DictReader(fin, delimiter=',')
        data = list(reader)
        data.sort(key=sortkey)
        
        writer = csv.DictWriter(fout, fieldnames=reader.fieldnames, delimiter=',')  
        writer.writeheader()
        writer.writerows(data)


def main():
    path = sys.argv[1]
    specialCases = ["Global", "Developing", "Developed", "High-income Asia Pacific","Western Europe","Andean Latin America","Central Latin America","Southern Latin America","Tropical Latin America","North Africa and Middle East","High-income North America","Oceania","Central Sub-Saharan Africa","Eastern Sub-Saharan Africa","Central Asia","Southern Sub-Saharan Africa","Western Sub-Saharan Africa","East Asia","South Asia","Southeast Asia","Australasia","Caribbean","Central Europe","Eastern Europe","Central Europe, Eastern Europe, and Central Asia","Sub-Saharan Africa","North Africa and Middle East","South Asia","Southeast Asia, East Asia, and Oceania","Latin America and Caribbean"]
    
    def sortkey(d):
        result = d["location_name"]
        if result in specialCases:
            numzeroes = len(str(len(specialCases)))
            result = str(specialCases.index(result)).zfill(numzeroes) + result
        return result
    
    filter = lambda row : row['age_group_id'] == "38" and row['metric'] == "obese"
    sortcsv(path, sortkey)

if __name__ == '__main__':
	main()