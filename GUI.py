import sys
from PySide2.QtWidgets import QApplication, QPushButton, QMessageBox
from PySide2.QtCore import Slot
from ENtoANKI import makefolder, recursive, move_images

@Slot()
def convert_evernote():
    makefolder()
    recursive()
    dial = QMessageBox()
    dial.setText("Finished Converting!")
    dial.setWindowTitle("Success!")
    dial.addButton(QMessageBox.Ok)
    dial.exec_()
    # move_images()

# Create the Qt Application
app = QApplication(sys.argv)
# Create a button, connect it and show it
button = QPushButton("Convert")
button.clicked.connect(convert_evernote)
button.show()
# Run the main Qt loop
app.exec_()