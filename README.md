# Pure Radar Sim: European Airspace Coverage Simulator

The Pure Radar Sim is an interactive strategic simulator designed for visualizing and analyzing airspace surveillance coverage across Europe. It allows users to model a network of radar and ADS-B sensors, visualize coverage gaps at different altitudes, and understand the impact of network configuration on a dynamic, procedurally generated air traffic environment. While the entire exercise is a work of fiction, the underlying principles of line-of-sight coverage and network planning are based on real-world concepts.


## Core Features

*   **Interactive Map Simulation:** Visualize European airspace on a dynamic Google Map, complete with a high-resolution grid that displays sensor coverage in real-time.
*   **Realistic Airspace Model:** The simulation is built on a comprehensive dataset of major European airports. The initial sensor network is procedurally generated based on real-world annual passenger traffic data.
*   **Dynamic Air Traffic Simulation:** Watch hundreds of aircraft fly realistic routes between active airports. Each flight follows a complete profile, including climb, cruise, and a dynamically calculated descent for a smooth landing.
*   **Live Coverage Analysis:** The map overlay instantly shows sensor coverage as a color-coded grid (Green for full, Orange for partial, Red for no coverage). As aircraft fly through these zones, their icons change color, providing immediate visual feedback on the network's effectiveness.
*   **Interactive Network Planning:**
    *   **Manual Placement:** A precision crosshair tool allows you to "test" a new sensor at any location. See the coverage grid update instantly, then confirm or cancel the placement.
    *   **Sensor Management:** Toggle individual sensors on or off to simulate outages and instantly see the impact on the network.
    *   **Region-Based Scenarios:** Activate or deactivate entire countries to focus the simulation on specific areas of interest, making analysis more manageable and performant.
*   **Automated Optimization Tools:**
    *   **"Auto-Fill" Algorithm:** A powerful client-side function that automatically analyzes the selected regions, finds the largest coverage gaps, and incrementally adds new sensors in economically and geographically sound locations (on land, with minimum separation) until resilience is achieved.
*   **Comprehensive Simulation Controls:** A full suite of controls including a start/pause button, a time-of-day indicator, and a speed slider to accelerate the simulation up to 1000x.
*   **Save & Load Your Work:** Export your custom-placed sensor network to a JSON file and import it later to continue your analysis or share scenarios.

## 🚀 Installation and Setup in Google AI Studio

Follow these steps to download the code and run your own instance of the application in Google AI Studio.

### Prerequisites

*   **Google Account:** You need a Google account to use Google AI Studio.
*   **Google Maps API Key:** This application requires a Google Maps API key with the "Maps JavaScript API" and "Places API" enabled.

### Step 1: Download the Project from GitHub

1.  On the project's GitHub repository page, click the green **< > Code** button.
2.  In the dropdown menu, select **"Download ZIP"**.
3.  Save the ZIP file to your computer and unzip it. You will now have a folder named something like `pure-radar-sim-main`.

### Step 2: Prepare the ZIP for AI Studio

This is a critical step. AI Studio requires the `index.html` file to be at the top level of the zip file, but the GitHub download puts it inside a folder. You must re-zip the core files.

1.  **Open the project folder.** Navigate inside the unzipped `pure-radar-sim-main` folder. You should see all the project files and folders (`index.html`, `App.tsx`, etc.).
2.  **Select all application files.** Select all the files and folders inside this directory.
    *   Include:
        *   `App.tsx`
        *   `constants.ts`
        *   `index.html`
        *   `index.tsx`
        *   `metadata.json`
        *   `README.md` (this file)
        *   `services/` (folder)
        *   `simulation.ts`
        *   `types.ts`
    *   Do not go back up and select the parent folder. Stay inside the `pure-radar-sim-main` folder.
3.  **Create the new ZIP file.** With all the app files selected, right-click and choose:
    *   **Windows:** "Send to" > "Compressed (zipped) folder".
    *   **Mac:** "Compress [X] items".
4.  Rename the new ZIP file to something clear, like `aistudio-radar-sim-upload.zip`.

**CRITICAL:** By zipping the contents directly, you ensure that `index.html` is at the root of your new zip file, which is what AI Studio needs.

### Step 3: Upload and Run in AI Studio

1.  **Go to the Google AI Studio App Gallery:** Open your web browser and navigate to `aistudio.google.com/app`.
2.  **Create a New App:** Click **"Create new"** and select **"Zip upload"**.
3.  **Upload Your ZIP:** Select the `aistudio-radar-sim-upload.zip` file you created in the previous step. AI Studio will build the project and launch the application.
4.  **Enter API Key:** The application will prompt you to enter your Google Maps API key on the first run.

The application is now ready to use!

## 📖 How to Use This Tool

1.  **Initial Load:** The application starts with a static map and a default sensor network for Belgium. The simulation is paused.
2.  **Explore the Network:** Pan and zoom to explore the coverage. Use the altitude sliders in the left panel to analyze coverage at different flight levels. Click on any grid cell to see a detailed coverage report for that location.
3.  **Configure the Scenario:** Use the "Active Regions" panel to activate more countries. The map will automatically update with the corresponding airport sensors and a new, more complex coverage grid.
4.  **Optimize Coverage:**
    *   **Manually:** Use the **"Place New Sensor"** workflow to test and confirm new sensor placements.
    *   **Automatically:** Use the **"Auto-Fill Coverage"** button to let the algorithm automatically build out the network to cover gaps in your selected countries.
5.  **Run the Simulation:** Click **"Start Simulation"** to begin the air traffic flow. Use the speed slider to accelerate time.
6.  **Analyze Live Traffic:** Watch aircraft icons change color as they fly through different coverage zones. Click on any aircraft to see a detailed report, including its flight plan and the percentage of its flight time spent in full, partial, or no coverage.
7.  **Save Your Work:** Use the **"Export User Sensors"** button to save your custom network. Use **"Import"** to load it back in a future session.

## Disclaimer

This is a strategic modeling tool, not a real-time air traffic control system. Flight paths are simplified for performance and do not represent official airways or real-time flight data. All air traffic is procedurally generated based on statistical airport data. The sensor models are simplified and do not account for terrain obstruction.
