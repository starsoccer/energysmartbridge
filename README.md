# EnergySmart Bridge
A Home Assistant add-on designed to repurpose the controllers for the now defunct [Lowe's EnergySmart Water Heater WiFi Controller](https://www.lowes.com/pd/EnergySmart-Electric-Plastic-Water-Heater-Controller/50292493) & possibly [Kenmore Smart Electric Water Heater Module](https://www.sears.com/kenmore-smart-water-heater-module/p-04258000000P). It should be capable of supporting AO Smith, Whirlpool, and Kenmore water heaters with the compatible port, but not all have been tested. Since these controllers were rendered worthless when the cloud service shut down. they should be fairly inexpensive to acquire.

## How it Works
The controller posts the status of the water heater every 5-6 minutes to https://energysmartwaterheater.com/. Any queued setting changes are returned in the json response. Since the cloud service is now offline, you must redirect the DNS to Home Assistant where this add-on will accept and control the communication. This traffic is on port 443 which is not in use by Home Assistant by default.

## Setup Instructions

### Prerequisites

- EnergySmart 612026 Electric Water Heater Controller(eBay is likely your best source if you don't already have one)
- A 2.4Ghz WiFi Network
- Ability to Control DNS on your Network
- Home Assistant Or Ability to run docker containers
- Compatible Water Heater -  Models are listed on the device packaging though the list is not exhaustive. AO Smith, Whirlpool, and Kenmore water heaters with this cover and port underneath will likely be compatible.
![Cap Over Connector](https://raw.githubusercontent.com/starsoccer/energysmartbridge/master/images/connector-cap.png)
![Connector](https://raw.githubusercontent.com/starsoccer/energysmartbridge/master/images/connector.png)

### Setup

#### MQTT Broker

Install a MQTT Broker(if you dont already have one setup)

If using Home Assistant you can do so with the following steps:

1. Navigate to the add-ons section of Home Assistant
2. Search for and then install "Mosquitto broker"
3. Create credentails to connect to the broker under configuration tab once installed. The format is as follows:
```
- username: YOUR-USERNAME-HERE
  password: YOUR-PASSWORD-HERE
```
4. Ensure you set Mosquitto broker to Start on Boot and Enable Watchdog

#### Energy Smart Bridge

Installing the Energy Smart Bridge Add-on. This communicates directly with the module connected to your hot water heater.

1. Navigate to the add-ons section of Home Assistant
2. Click the 3 dots in the top right followed by Repositories
3. Add this to your repository list: https://github.com/starsoccer/energysmartbridge
4. Next click the 3 dots in the top right again followed by Check for Updates
5. You should now be able to search and find Energy Smart Bridge as an add-on. If you can not try force refreshing the webpage using f5.
6. Install the Energy Smart Bridge add-on
7. Once installed navigate to the configuration tab.
8. Enter the MQTT Server port, by default this is 1883 and you can leave it as is
9. Enter the MQTT Servers IP address. Assuming you are using the Mosquitto Broker you can just enter Home Assistants IP Address
10. Enter the MQTT Username you set in the prior steps followed by the password
11. Finally Start Energy Smart Bridge, set it to Start on Boot, and Enable Watchdog

#### Configure your local DNS

You need to add to your network DNS (via Pi-hole, pfSense, or some other method) the following domains to point to your Home Assistant IP address:

- energysmartwaterheater.com
- devices.irissmarthome.com

This tells the module connected to your hot water heater that when it does an update instead of talking to the now defunct website to talk to the Energy Smart Bridge add-on instead.

#### Connect the Water Heater Controller

It is at this point it should be pointed out that doing this could cause damage to your water heater, void your warranty, or worse. DRAGONS AHEAD, TURN BACK NOW!

It is a good idea to cut power to your water heater before installing the controller. After you physically install it and turn power back on you should continue to follow the controller's instruction manual to connect it to your network. It defaults to an AP mode so you will connect to it with another device and tell it which network to connect to.

That's it

If you've done all of this correctly, the controller should begin reporting data to the Energy Smart Bridge, which in turn reports it to Mosquitto broker. Entities should be automatically created in your Home Assistant.

## Some Important Notes and Caveats

**The controller reports in about every 5-6 minutes and won't pick up mode or temperature changes until it reports in. Be patient when changing settings.**

**Remote Administration setting does not matter.** It can be on or off and should not have any effect on your ability to change the temperature or mode.

**The mode as shown in Home Assistant for the water_heater entity will likely not match what your water heater's mode actually is.** This is because the entity in Home Assistant has preset mode options and they could not be changed to match. The current mapping is as follows:

| Home Assistant Mode  | Water Heater Mode |
| ------------- | ------------- |
| heat_pump  | Efficiency  |
| eco | Hybrid |
| eco | EnergySmart |
| electric  | Electric  |
| electric  | Standard  |
| off  | Vaction  |

For this reason, there is another sensor called, `Water Heater Raw Mode` included that will report the mode exactly as reported by the water heater rather than the translated mode

**140F is the highest the temperature can be set.** The actual water heater may be capable of going higher, but the controller will not set a setting higher than 140F.

**If you are using Celsius you're on your own.** I have no idea how this will work with Celsius.

## Credit
Credit to [@excaliburpartners](https://github.com/excaliburpartners/EnergySmartBridge) on most of the original work. 99% of this code is theirs. I have just tweaked their code in order to make setup within Home assistant easier and expose more sensors.

## Misc Links/Info

- https://www.instructables.com/AO-Smith-Water-Heater-Monitor-Lowes-IRIS/
- https://web.archive.org/web/20200926235632/https://github.com/LoneWolf345/hassio-add-ons
- https://cocoontech.com/threads/homeseer-3-and-openhab.31113/page-2
- https://forums.homeseer.com/forum/hs4-products/hs4-plugins/lighting-primary-technology-plug-ins-aa/mcsmqtt-michael-mcsharry-aa/1531027-any-solution-for-cta-2045-and-mqtt
