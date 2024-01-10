import shutil
import os
import zipfile


def safe_copy(file_path, out_dir, dst=None) -> str:
    """Safely copy a file to the specified directory. If a file with the same name already
    exists, the copied file name is altered to preserve both.

    :param str file_path: Path to the file to copy.
    :param str out_dir: Directory to copy the file into.
    :param str dst: New name for the copied file. If None, use the name of the original
        file.
    """
    name = dst or os.path.basename(file_path)
    final_name = name
    if not os.path.exists(os.path.join(out_dir, name)):
        destination = os.path.join(out_dir, name)
        shutil.copy(file_path, destination)
        final_name = destination
    else:
        base, extension = os.path.splitext(name)
        i = 1
        while os.path.exists(os.path.join(out_dir, '{}_{}{}'.format(base, i, extension))):
            i += 1
        destination = os.path.join(out_dir, '{}_{}{}'.format(base, i, extension))
        shutil.copy(file_path, destination)
        final_name = destination
    return final_name


def zip_directory(directory_path, zip_path):
    with zipfile.ZipFile(zip_path, 'w') as zipf:
        for root, dirs, files in os.walk(directory_path):
            for file in files:
                zipf.write(
                    os.path.join(root, file),
                    os.path.relpath(
                        os.path.join(root, file),
                        os.path.join(directory_path, '..')
                    )
                )