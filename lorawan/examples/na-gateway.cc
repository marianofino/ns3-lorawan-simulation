/*
 * This example is based on the network-server-example provided by the NS3
 * LoRaWAN module.
 */

#include "ns3/point-to-point-module.h"
#include "ns3/na-forwarder-helper.h"
#include "ns3/network-server-helper.h"
#include "ns3/lora-channel.h"
#include "ns3/mobility-helper.h"
#include "ns3/lora-phy-helper.h"
#include "ns3/na-lorawan-mac-helper.h"
#include "ns3/lora-helper.h"
#include "ns3/gateway-lora-phy.h"
#include "ns3/periodic-sender.h"
#include "ns3/periodic-sender-helper.h"
#include "ns3/log.h"
#include "ns3/string.h"
#include "ns3/command-line.h"
#include "ns3/core-module.h"
#include "ns3/network-module.h"
#include "ns3/lora-device-address-generator.h"
#include "ns3/one-shot-sender-helper.h"

#include <iostream>
#include <fstream>
#include <vector>
#include <sstream>
#include <string>

#define LENGTH 10000

using namespace ns3;
using namespace lorawan;
using namespace std;

string endDevicesCSVPath = "end_device_data.csv";
string gatewaysCSVPath = "gateway_data.csv";
double simulationHours = 1;
double msgPeriod = 20;
int msgSize = 10;
int naMode = 1;
int32_t budgetPerNode = 19;
int maxPackets = 1;

int totalPackets = 0;
int duplicatedRxByNS = 0;
int nonDuplicatedRxByNS = 0;
int discardedPacketsRxByNS = 0;
int discardedDupPacketsNotRxByNS = 0;
int discardedPacketsNotRxByNS = 0;
int64_t receivedPacketsUID[LENGTH]; // TODO change this structure??
int64_t discardedPacketsUID[LENGTH]; // TODO change this structure??
int64_t discardedNotRxPacketsUID[LENGTH]; // TODO change this structure??
int rxArrayLength = 0;
int discArrayLength = 0;
int discNotRxArrayLength = 0;
int priorityLvl = 1;

NS_LOG_COMPONENT_DEFINE ("NA_Gateway");

void OnNSReceivedPackets (Ptr<Packet const> packet)
{
  int64_t packetUid = (int64_t)packet->GetUid();

  // print the content of my packet on the standard output.
  //packet->Print (std::cout);
  //std::cout << std::endl;

  int64_t *uidPosition = std::find(std::begin(receivedPacketsUID), std::end(receivedPacketsUID), packetUid);
  if (uidPosition != std::end(receivedPacketsUID)) {
    duplicatedRxByNS++;
  } else {
    nonDuplicatedRxByNS++;
    receivedPacketsUID[rxArrayLength++] = packetUid;
  }

}

void OnDiscardedPackets (Ptr<Packet const> packet)
{
  int64_t packetUid = (int64_t)packet->GetUid();
  discardedPacketsUID[discArrayLength++] = packetUid;
}

void OnBestGatewayFound (Ptr<Node> gateway, LoraDeviceAddress edAddress)
{
  gateway->GetApplication(0)->GetObject<NA_Forwarder>()->SetAsBestGateway(edAddress);
}

bool GatewayTxFilter (Ptr<NA_Forwarder> frwder, Ptr<const Packet> packet)
{
  bool allowed = true;

  totalPackets++;

  if (naMode == 0)
  {
    return allowed;
  }

  Ptr<Packet> packetCopy = packet->Copy ();
  LorawanMacHeader receivedMacHdr;
  packetCopy->RemoveHeader (receivedMacHdr);
  LoraFrameHeader receivedFrameHdr;
  packetCopy->RemoveHeader (receivedFrameHdr);

  LoraDeviceAddress edAddress = receivedFrameHdr.GetAddress();
  std::map<uint32_t, deviceData_t> * addressTable = frwder->GetAddressTable();

  switch (naMode)
  {
    case 1: // By Node ID
    {
      const auto it = addressTable->find (edAddress.Get());
      if (it == addressTable->end () || it->second.isBestGateway == false)
      {
        allowed = false;
      }
    }
    break;
    case 2: // By Priority
    {
      const auto it = addressTable->find (edAddress.Get());
      if (it != addressTable->end () && it->second.priority > priorityLvl)
      {
        allowed = false;
      }
    }
    break;
    case 3: // By Budget
    {
      const auto it = addressTable->find (edAddress.Get());
      if (it != addressTable->end ())
      {
        Time now = Simulator::Now();
        uint8_t currentHour = now.GetHours();
        uint8_t previousHour = it->second.lastOkPacketAt.GetHours();

        if (it->second.lastOkPacketAt.IsZero() == false && currentHour != previousHour)
        {
          it->second.budget = budgetPerNode;
        }

        it->second.budget -= packet->GetSize(); // TODO change to number of packets???

        if (it->second.budget < 0)
        {
          allowed = false;
        }

        it->second.lastOkPacketAt = now;
      }
    }
    break;
    case 4: // By Max Packets
    {
      const auto it = addressTable->find (edAddress.Get());
      if (it != addressTable->end ())
      {
        Time now = Simulator::Now();
        uint8_t currentHour = now.GetHours();
        uint8_t previousHour = it->second.lastOkPacketAt.GetHours();

        if (it->second.lastOkPacketAt.IsZero() == false && currentHour != previousHour)
        {
          it->second.maxPackets = maxPackets;
        }

        it->second.maxPackets -= 1; // TODO change to number of packets???

        if (it->second.maxPackets < 0)
        {
          allowed = false;
        }

        it->second.lastOkPacketAt = now;
      }
    }
    break;
/*
    case 4: // By Consumers
    {
      const auto it = addressTable->find (edAddress.Get());
      if (it != addressTable->end ())
      {
        Time now = Simulator::Now();
        uint8_t currentHour = now.GetHours();
        uint8_t previousHour = it->second.lastOkPacketAt.GetHours();

        // Check that there 1 packet per hour
        if (it->second.lastOkPacketAt.IsZero() == false && currentHour == previousHour)
        {
          allowed = false;
        }
        else
        {
          it->second.lastOkPacketAt = now;
        }


      }
    }
*/
  }

  if (!allowed)
  {
    OnDiscardedPackets(packet);
  }

  return allowed;
}

unsigned int getRepeatedElementsInArrays(int64_t * arr1, int64_t * arr2)
{
  unsigned int repeated = 0;

  for (int i=0; i < rxArrayLength; i++)
  {
    for (int j=0; j < discArrayLength; j++)
    {
      if (arr1[i] == arr2[j])
      {
        repeated++;
      }
    }
  }

  return repeated;
}

void PutElementsOnlyInArr1(int64_t * arr1, int64_t * arr2)
{
  for (int i=0; i < discArrayLength; i++)
  {
    bool presentInArr2 = false;
    for (int j=0; j < rxArrayLength; j++)
    {
      if (arr1[i] == arr2[j])
      {
        presentInArr2 = true;
        break;
      }
    }
    if (!presentInArr2)
    {
      discardedNotRxPacketsUID[discNotRxArrayLength++] = arr1[i];
    }
  }
}

int getUniqueElements(int64_t * arr, int n)
{
  if (n == 0)
    return 0;
  int res = 1;
 
  // Pick all elements one by one
  for (int i = 1; i < n; i++) {
    int j = 0;
    for (j = 0; j < i; j++)
      if (arr[i] == arr[j])
        break;

    // If not printed earlier, then print it
    if (i == j)
      res++;
  }
  return res;
}

int getRepeatedElements(int64_t * arr, int n)
{
  int res = 0;
  for (int i = 0; i < n - 1; i++)
  {
    for (int j = i + 1;j < n; j++)
    {
      if (arr[i] == arr[j])
        res++;
    }
  }
  return res;
}

int main (int argc, char *argv[])
{

  // Enable the packet printing through Packet::Print command.
  Packet::EnablePrinting ();

  bool verbose = false;

  CommandLine cmd;
  cmd.AddValue ("verbose", "Whether to print output or not", verbose);
  cmd.AddValue ("endDevicesCSV", "Path to file containing end devices location to include in the simulation", endDevicesCSVPath);
  cmd.AddValue ("gatewaysCSV", "Path to file containing gateways location to include in the simulation", gatewaysCSVPath);
  cmd.AddValue ("simulationHours", "The time in hours for which to simulate", simulationHours);
  cmd.AddValue ("msgPeriod", "The period in minutes to be used by periodically transmitting End Devices", msgPeriod);
  cmd.AddValue ("msgSize", "The size of the packet payload of the transmitted messages", msgSize);
  cmd.AddValue ("naMode", "The Node Aware traffic shaping policy of gateways (0: disabled, 1-4: see README)", naMode);
  cmd.AddValue ("priorityLvl", "Above this level, all packets will be filtered.", priorityLvl);
  cmd.AddValue ("budgetPerNode", "Budget in bytes allowed to be sent by each End Device.", budgetPerNode);
  cmd.AddValue ("maxPackets", "Max qty of packets allowed to be sent by each End Device.", maxPackets);
  cmd.Parse (argc, argv);

  for (int i=0; i < LENGTH; i++) {
    receivedPacketsUID[i] = -1;
    discardedPacketsUID[i] = -1;
  }

  // Logging
  //////////

  //LogComponentEnable ("Forwarder", LOG_LEVEL_ALL);
  //LogComponentEnable ("GatewayLorawanMac", LOG_LEVEL_ALL);
  //LogComponentEnable ("LorawanMacHelper", LOG_LEVEL_ALL);
  LogComponentEnableAll (LOG_PREFIX_FUNC);
  LogComponentEnableAll (LOG_PREFIX_NODE);
  LogComponentEnableAll (LOG_PREFIX_TIME);

  // Create a simple wireless channel
  ///////////////////////////////////

  Ptr<LogDistancePropagationLossModel> loss = CreateObject<LogDistancePropagationLossModel> ();
  loss->SetPathLossExponent (3.76);
  loss->SetReference (1, 7.7);

  Ptr<PropagationDelayModel> delay = CreateObject<ConstantSpeedPropagationDelayModel> ();

  Ptr<LoraChannel> channel = CreateObject<LoraChannel> (loss, delay);

  // Helpers
  //////////

  // End Device mobility
  MobilityHelper mobilityEd, mobilityGw;
  Ptr<ListPositionAllocator> positionAllocEd = CreateObject<ListPositionAllocator> ();

  ifstream endDevicesCSV(endDevicesCSVPath);

  string line, word;
  vector<string> row;
  int totalEndDevices = 0;

  if (endDevicesCSV.is_open())
  {
    getline (endDevicesCSV, line); // ignore headers
    while ( getline (endDevicesCSV, line) )
    {
      row.clear();
      stringstream s(line);
      while (getline(s, word, ','))
      {
        row.push_back(word);
      }
      positionAllocEd->Add (Vector (stof(row[0]), stof(row[1]), stof(row[2])));
      totalEndDevices++;
    }
    endDevicesCSV.close();
  }

  mobilityEd.SetPositionAllocator (positionAllocEd);
  mobilityEd.SetMobilityModel ("ns3::ConstantPositionMobilityModel");

  // Gateway mobility
  Ptr<ListPositionAllocator> positionAllocGw = CreateObject<ListPositionAllocator> ();

  ifstream gatewaysCSV(gatewaysCSVPath);
  int totalGateways = 0;

  if (gatewaysCSV.is_open())
  {
    getline (gatewaysCSV, line); // ignore headers
    while ( getline (gatewaysCSV, line) )
    {
      row.clear();
      stringstream s(line);
      while (getline(s, word, ','))
      {
        row.push_back(word);
      }
      positionAllocGw->Add (Vector (stof(row[0]), stof(row[1]), stof(row[2])));
      totalGateways++;
    }
    gatewaysCSV.close();
  }

  mobilityGw.SetPositionAllocator (positionAllocGw);
  mobilityGw.SetMobilityModel ("ns3::ConstantPositionMobilityModel");

  // Create the LoraPhyHelper
  LoraPhyHelper phyHelper = LoraPhyHelper ();
  phyHelper.SetChannel (channel);

  // Create the LorawanMacHelper
  NA_LorawanMacHelper macHelper = NA_LorawanMacHelper ();

  // Create the LoraHelper
  LoraHelper helper = LoraHelper ();

  // Create EDs
  /////////////

  NodeContainer endDevices;
  endDevices.Create (totalEndDevices);
  mobilityEd.Install (endDevices);

  // Create a LoraDeviceAddressGenerator
  uint8_t nwkId = 0;
  uint32_t nwkAddr = 1864;
  Ptr<LoraDeviceAddressGenerator> addrGen = CreateObject<LoraDeviceAddressGenerator> (nwkId,nwkAddr);

  // Create the LoraNetDevices of the end devices
  phyHelper.SetDeviceType (LoraPhyHelper::ED);
  macHelper.SetDeviceType (NA_LorawanMacHelper::ED_A);
  macHelper.SetAddressGenerator (addrGen);
  macHelper.SetRegion (NA_LorawanMacHelper::EU);
  helper.Install (phyHelper, macHelper, endDevices);

  int appPeriodSeconds = msgPeriod*60;
  PeriodicSenderHelper appHelper = PeriodicSenderHelper ();
  appHelper.SetPeriod (Seconds (appPeriodSeconds));
  appHelper.SetPacketSize (msgSize);
  ApplicationContainer appContainer = appHelper.Install (endDevices);

  ////////////////
  // Create GWs //
  ////////////////

  NodeContainer gateways;
  gateways.Create (totalGateways);
  mobilityGw.Install (gateways);

  // Create the LoraNetDevices of the gateways
  phyHelper.SetDeviceType (LoraPhyHelper::GW);
  macHelper.SetDeviceType (LorawanMacHelper::GW);
  helper.Install (phyHelper, macHelper, gateways);

  ////////////
  // Create NS
  ////////////

  NodeContainer networkServers;
  networkServers.Create (1);

  // Install the NetworkServer application on the network server
  NetworkServerHelper networkServerHelper;
  networkServerHelper.SetGateways (gateways);
  networkServerHelper.SetEndDevices (endDevices);
  networkServerHelper.Install (networkServers);

  for (NodeContainer::Iterator j = networkServers.Begin (); j != networkServers.End (); ++j)
  {
    Ptr<Node> node = *j;
    Ptr<NetworkServer> nwServer = node->GetApplication(0)->GetObject<NetworkServer> ();
    nwServer->TraceConnectWithoutContext("ReceivedPacket", MakeCallback(&OnNSReceivedPackets));
  }

  // Install the Forwarder application on the gateways
  NA_ForwarderHelper forwarderHelper;
  forwarderHelper.Install (gateways);

  // Set Gateway Tx Filter function
  for (NodeContainer::Iterator j = gateways.Begin (); j != gateways.End (); ++j)
  {
    Ptr<Node> node = *j;
    node->GetApplication(0)->GetObject<NA_Forwarder>()->SetGatewayFilterTxCallback(MakeCallback(&GatewayTxFilter));
  }

  // Set End Device information in gateways; in real implementations this should be downloaded by Network Server
  uint8_t edPriority = 1;
  for (NodeContainer::Iterator j = endDevices.Begin (); j != endDevices.End (); ++j)
  {
    Ptr<Node> node = *j;
    LoraDeviceAddress edAddress = node->GetDevice (0)->GetObject<LoraNetDevice> ()->GetMac ()->GetObject<ClassAEndDeviceLorawanMac> ()->GetDeviceAddress();

    // Uniformly assign priority from 1 to 5
    edPriority = edPriority == 5 ? 1 : edPriority + 1;

    for (NodeContainer::Iterator currentGw = gateways.Begin (); currentGw != gateways.End ();
         ++currentGw)
      {
        Ptr<NA_Forwarder> frwder = (*currentGw)->GetApplication(0)->GetObject<NA_Forwarder>();
        frwder->AddEndDevice(edAddress, edPriority, budgetPerNode, maxPackets);
      }
  }

  // Set spreading factors up
  macHelper.SetSpreadingFactorsUp (endDevices, gateways, channel, MakeCallback(&OnBestGatewayFound));

  // Start simulation
  Simulator::Stop (Seconds (60*60*simulationHours));
  Simulator::Run ();

  std::cout << "{" << std::endl;

  std::cout << "\t\"args\": {" << std::endl;

  std::cout << "\t\t\"simulationHours\":" << simulationHours << "," << std::endl;
  std::cout << "\t\t\"msgPeriod\":" << msgPeriod << "," << std::endl;
  std::cout << "\t\t\"msgSize\":" << msgSize << "," << std::endl;
  std::cout << "\t\t\"naMode\":" << naMode << "," << std::endl;
  std::cout << "\t\t\"priorityLvl\":" << priorityLvl << "," << std::endl;
  std::cout << "\t\t\"budgetPerNode\":" << budgetPerNode << "," << std::endl;
  std::cout << "\t\t\"maxPackets\":" << maxPackets << std::endl;

  std::cout << "\t}," << std::endl;

  std::cout << "\t\"results\": {" << std::endl;
  std::cout << "\t\t\"totalEndDevices\": " << totalEndDevices << "," << std::endl;
  std::cout << "\t\t\"totalGateways\": " << totalGateways << "," << std::endl;
  std::cout << "\t\t\"packets\": {" << std::endl;

  std::cout << "\t\t\t\"total\": " << totalPackets << "," << std::endl;

  std::cout << "\t\t\t\"rxByNS\": {" << std::endl;

  std::cout << "\t\t\t\t\"nonDuplicated\": " << nonDuplicatedRxByNS << "," << std::endl;
  std::cout << "\t\t\t\t\"duplicated\": " << duplicatedRxByNS << std::endl;

  std::cout << "\t\t\t}," << std::endl;

  std::cout << "\t\t\t\"discardedByGtws\": {" << std::endl;

  std::cout << "\t\t\t\t\"duplicatedAndRxByNS\": " << getRepeatedElementsInArrays(receivedPacketsUID, discardedPacketsUID) << "," << std::endl;
  PutElementsOnlyInArr1(discardedPacketsUID, receivedPacketsUID);
  std::cout << "\t\t\t\t\"uniqueAndNotRxByNS\": " << getUniqueElements(discardedNotRxPacketsUID, discNotRxArrayLength) << "," << std::endl;
  std::cout << "\t\t\t\t\"duplicatedAndNotRxByNS\": " << getRepeatedElements(discardedNotRxPacketsUID, discNotRxArrayLength) << std::endl;

  std::cout << "\t\t\t}" << std::endl;

  std::cout << "\t\t}" << std::endl;
  std::cout << "\t}" << std::endl;
  std::cout << "}" << std::endl;

  /*

  {
    totalDevices:
    totalGateways:
    packets:
      rxByNS: {
        nonDuplicated:
        duplicated:
      },
      discardedByGtw: {
        duplicatedAndRxByNS:
        uniqueAndNotRxByNS:
        duplicatedAndNotRxByNS:
      }
  }

  */

/*
  std::cout << "Simulation Summary:" << std::endl;
  std::cout << "===================" << std::endl;
  std::cout << " " << std::endl;
  std::cout << "* Rx Non-Duplicated Packets by NS: " << nonDuplicatedRxByNS << std::endl;
  std::cout << "* Rx Duplicated Packets by NS: " << duplicatedRxByNS << std::endl;
  std::cout << " " << std::endl;
  std::cout << "* Discarded Duplicated Packets Rx by NS: " << getRepeatedElementsInArrays(receivedPacketsUID, discardedPacketsUID) << std::endl;
  PutElementsOnlyInArr1(discardedPacketsUID, receivedPacketsUID);
  std::cout << "* Discarded Unique Packets Not Rx by NS: " << getUniqueElements(discardedNotRxPacketsUID, discNotRxArrayLength) << std::endl;
  std::cout << "* Discarded Duplicated Packets Not Rx by NS: " << getRepeatedElements(discardedNotRxPacketsUID, discNotRxArrayLength) << std::endl;
*/

  Simulator::Destroy ();

  return 0;
}
