import os
import glob2
import datetime


PATH = os.path.dirname(os.path.abspath(__file__))
os.chdir(PATH)

def rename_img(filepath):
    folder, filename = os.path.split(filepath)
    filename, extension = os.path.splitext(filename)
    src = filepath
    current_time = str(datetime.datetime.now().date()) + '_' + str(datetime.datetime.now().time()).replace(':', '.') + '_'
    dest = os.path.join(f'{current_time}' + filename + extension)
    os.rename(src, dest)

def find_img():
    imgs = glob2.glob('*.jpeg')
    imgs.extend(glob2.glob('**/*.png'))
    imgs.extend(glob2.glob('**/*.jpg'))
    imgs.extend(glob2.glob('**/*.gif'))
    imgs.extend(glob2.glob('**/*.tiff'))
    for img in imgs:
        rename_img(img)


def main():
    find_img()

if __name__ == "__main__":
    main()