import sys
from pathlib import Path

from PySide6.QtWidgets import QApplication

sys.path.append(str(Path(__file__).resolve().parent))

from ui.main_window import MainWindow


def main():
    app = QApplication(sys.argv)
    
    # Set application style
    app.setStyle("Fusion")
    
    window = MainWindow()
    window.show()
    
    sys.exit(app.exec())


if __name__ == "__main__":
    main()
