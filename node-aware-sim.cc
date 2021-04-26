/*
 * This example is based on the network-server-example provided by the NS3
 * LoRaWAN module.
 */

#include "ns3/point-to-point-module.h"
#include "ns3/forwarder-helper.h"
#include "ns3/network-server-helper.h"
#include "ns3/lora-channel.h"
#include "ns3/mobility-helper.h"
#include "ns3/lora-phy-helper.h"
#include "ns3/lorawan-mac-helper.h"
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

int duplicatedRxByNS = 0;
int nonDuplicatedRxByNS = 0;
int bytesRxByNS = 0;
int64_t packetsUID[LENGTH] = {0};
int arrayLength = 0;

NS_LOG_COMPONENT_DEFINE ("NetworkServerExample");

void OnNSReceivedPackets (Ptr<Packet const> packet)
{
  int64_t packetUid = (int64_t)packet->GetUid();

  int64_t *uidPosition = std::find(std::begin(packetsUID), std::end(packetsUID), packetUid);
  if (uidPosition != std::end(packetsUID)) {
    duplicatedRxByNS++;
  } else {
    nonDuplicatedRxByNS++;
    bytesRxByNS += packet->GetSize();
    packetsUID[arrayLength++] = packetUid;
  }

}

int main (int argc, char *argv[])
{

  bool verbose = false;

  CommandLine cmd;
  cmd.AddValue ("verbose", "Whether to print output or not", verbose);
  cmd.Parse (argc, argv);

  //ns3::Packet::EnablePrinting();

  for (int i=0; i < LENGTH; i++) {
    packetsUID[i] = -1;
  }

  // Logging
  //////////

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

  ifstream end_device_csv_file("end_device_data.csv");

  string line, word;
  vector<string> row;

  if (end_device_csv_file.is_open())
  {
    while ( getline (end_device_csv_file, line) )
    {
      row.clear();
      stringstream s(line);
      while (getline(s, word, ','))
      {
        row.push_back(word);
      }
      positionAllocEd->Add (Vector (stof(row[0]), stof(row[1]), stof(row[2])));
    }
    end_device_csv_file.close();
  }

  mobilityEd.SetPositionAllocator (positionAllocEd);
  mobilityEd.SetMobilityModel ("ns3::ConstantPositionMobilityModel");

  // Gateway mobility
  Ptr<ListPositionAllocator> positionAllocGw = CreateObject<ListPositionAllocator> ();

  ifstream gateway_data_csv_file("gateway_data.csv");

  if (gateway_data_csv_file.is_open())
  {
    while ( getline (gateway_data_csv_file, line) )
    {
      row.clear();
      stringstream s(line);
      while (getline(s, word, ','))
      {
        row.push_back(word);
      }
      positionAllocGw->Add (Vector (stof(row[0]), stof(row[1]), stof(row[2])));
    }
    gateway_data_csv_file.close();
  }

  mobilityGw.SetPositionAllocator (positionAllocGw);
  mobilityGw.SetMobilityModel ("ns3::ConstantPositionMobilityModel");

  // Create the LoraPhyHelper
  LoraPhyHelper phyHelper = LoraPhyHelper ();
  phyHelper.SetChannel (channel);

  // Create the LorawanMacHelper
  LorawanMacHelper macHelper = LorawanMacHelper ();

  // Create the LoraHelper
  LoraHelper helper = LoraHelper ();

  // Create EDs
  /////////////

  NodeContainer endDevices;
  endDevices.Create (117);
  mobilityEd.Install (endDevices);

  // Create a LoraDeviceAddressGenerator
  uint8_t nwkId = 0;
  uint32_t nwkAddr = 1864;
  Ptr<LoraDeviceAddressGenerator> addrGen = CreateObject<LoraDeviceAddressGenerator> (nwkId,nwkAddr);

  // Create the LoraNetDevices of the end devices
  phyHelper.SetDeviceType (LoraPhyHelper::ED);
  macHelper.SetDeviceType (LorawanMacHelper::ED_A);
  macHelper.SetAddressGenerator (addrGen);
  macHelper.SetRegion (LorawanMacHelper::EU);
  helper.Install (phyHelper, macHelper, endDevices);

  int appPeriodSeconds = 20*60;      // One packet every 20 minutes
  PeriodicSenderHelper appHelper = PeriodicSenderHelper ();
  appHelper.SetPeriod (Seconds (appPeriodSeconds));
  ApplicationContainer appContainer = appHelper.Install (endDevices);

  ////////////////
  // Create GWs //
  ////////////////

  NodeContainer gateways;
  gateways.Create (3);
  mobilityGw.Install (gateways);

  // Create the LoraNetDevices of the gateways
  phyHelper.SetDeviceType (LoraPhyHelper::GW);
  macHelper.SetDeviceType (LorawanMacHelper::GW);
  helper.Install (phyHelper, macHelper, gateways);

  // Set spreading factors up
  macHelper.SetSpreadingFactorsUp (endDevices, gateways, channel);

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
  ForwarderHelper forwarderHelper;
  forwarderHelper.Install (gateways);

  // Start simulation
  Simulator::Stop (Seconds (60*60*24));
  Simulator::Run ();
  std::cout << "Duplicated Packets rx by NS: " << duplicatedRxByNS << std::endl;
  std::cout << "Non-Duplicated Packets rx by NS: " << nonDuplicatedRxByNS << std::endl;
  Simulator::Destroy ();

  return 0;
}
