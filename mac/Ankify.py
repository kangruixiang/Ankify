import os
import datetime
from pathlib import Path
import PySimpleGUI as sg
from MDtoANKI import makefolder, writefile, recursive, move_images

layout = [[sg.Text('Select Folder')],
            [sg.Input(), sg.FolderBrowse()],
            [sg.OK('Convert')]]

sg.SetOptions(button_color=sg.COLOR_SYSTEM_DEFAULT)

event, values = sg.Window('Ankify', layout).Read()
md_path = os.path.abspath(values[0])
os.chdir(md_path)
try:
    values[0] = values[0].replace('/', '\\')
    makefolder()
    recursive()
    move_images()
except Exception as e:
    print(e)
    input("Error")

sg.Popup(f"Finished converting markdown files in {values[0]}")