import os
import datetime
from pathlib import Path
import PySimpleGUI as sg
from MDtoANKI import makefolder, writefile, recursive, move_images

layout = [[sg.Text('Select Folder')],
            [sg.Input(), sg.FolderBrowse()],
            [sg.OK('Convert')]]

event, values = sg.Window('Ankify', layout).Read()

try:
    md_path = os.path.abspath(values[0])
    os.chdir(md_path)
    values[0] = values[0].replace('/', '\\')
    makefolder()
    recursive()
    move_images()
except Exception as e:
    print(e)
    input("Error")

sg.Popup(f"Finished converting markdown files in {values[0]}")