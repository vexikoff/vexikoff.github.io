import subprocess
import json 
import time
import os
import requests
import sys
import keyboard
from rich import print
from rich.console import Console
from rich.panel import Panel
from rich.live import Live
from rich.prompt import Prompt
from pathlib import Path
from zipfile import ZipFile

console = Console()

dow = Path.home() / "Downloads"
zipp = dow / "LDK.zip"
ext = dow / "Lide Drum Kit"

jurl = "https://cdn.vexikoff.xyz/ldk/info.json"

while True:
    try:
        data = requests.get(jurl, timeout=15).json()
        break
    except Exception as e:
        console.print("RU: Проверьте подключение к интернету...\nEN: Check internet connection...", style="red")
        console.print("\nDev:", style="red")
        console.print(e, style="red")
        time.sleep(15)
        console.clear()

slk1 = data.get("1")
slk2 = data.get("2")
newsb = data.get("news", {})

sortd = sorted(newsb, key=int, reverse=True)
items = [newsb[k] for k in sortd]

def main(maintoken):
    while True:
        console.clear()
        console.print("LOG-ID: ", maintoken)

        text1 = "Lide Drum Kit Launcher"
        current1 = ""

        text2 = "1. Github \n2. Google Drive\n3. News"
        current2 = ""

        with Live(auto_refresh=False) as live:
            for char1 in text1:
                current1 += char1
                live.update(Panel.fit(f"{current1}", style="bold #f1bfff"), refresh=True)
                time.sleep(0.02)

        with Live(auto_refresh=False) as live:
            for char2 in text2:
                current2 += char2
                live.update(Panel(f"{current2}", style="#f1bfff", title="Download"), refresh=True)
                time.sleep(0.02)

        console.print("RU: Ваш выбор\nEN: Your choice", style="#f1bfff")
        choice = Prompt.ask(
            "[#f1bfff][1/2/3][/] [#f1bfff](1)[/]",
            default="1",
            choices=["1","2","3"],
            show_choices=False,
            show_default=False
        )

        text3 = "RU: Начинается скачивание...\nEN: Starting download..."
        current3 = ""

        console.print(f"RU: Ваш выбор: [#f1bfff]{choice}[/]\nEN: Your choice: [#f1bfff]{choice}[/]", style="#f1bfff")

        if choice == "3":
            print(Panel.fit("\n".join(items), title="News", style="#f1bfff"))
            keyboard.read_event()

        else:
            with Live(auto_refresh=False) as live:
                for char3 in text3:
                    current3 += char3
                    live.update(Panel.fit(f"{current3}", style="bold #f1bfff"), refresh=True)
                    time.sleep(0.1)

            outks = slk1 if choice == "1" else slk2

            try:
                res = requests.get(outks, stream=True, timeout=15)
                res.raise_for_status()
                with open(zipp, "wb") as f:
                    for chk in res.iter_content(chunk_size=8192):
                        f.write(chk)
                with ZipFile(zipp, "r") as z_r:
                        z_r.extractall(ext)
            except Exception as e:
                console.clear
                console.print(e)
                time.sleep(15)

            console.print("RU: [bold]Успешно[/]\nEN: [bold]Success[/]", style="#f1bfff")

            time.sleep(1)

            os.startfile(str(ext))

            time.sleep(3)


if __name__ == "__main__":
    while True:
        console.clear()
        print(Panel.fit("Lide Drum Kit Launcher", style="bold #f1bfff"))
        console.print("RU: Сначала вам нужно решить капчу, чтобы подтвердить, что вы не робот.\nEN: First, you need to solve the captcha to confirm that you are not a robot.", style="#f1bfff")

        if getattr(sys, "frozen", False):
            base_path = sys._MEIPASS
        
        else:
            base_path = os.path.dirname(os.path.abspath(__file__))

        exe_path = os.path.join(base_path, "captcha", "vexicaptcha.exe")

        try:
            process = subprocess.Popen(
                [exe_path],
                stdout=subprocess.PIPE,
                creationflags=subprocess.CREATE_NO_WINDOW
            )

            stdout, _ = process.communicate()
            output = stdout.decode('utf-8', errors='replace')
            output = output.strip()

            lines = output.splitlines()
            result_line = lines[-1]

        except Exception as e:
            console.clear
            console.print(e)
            time.sleep(15)

        result = json.loads(result_line)

        if result.get("solved") is True:
            token = result.get("token")
            main(token)
            break

        elif result.get("closedByUser") is True:
            console.print("RU: Пользователь закрыл окно\nEN: User closed the window", style="#f1bfff")
            time.sleep(2)
            break

        else:
            console.print("RU: Капча не решена\nEN: Captcha not solved", style="#f1bfff")
            time.sleep(2)