/* -*- Mode:C++; c-file-style:"gnu"; indent-tabs-mode:nil; -*- */
/*
 * Copyright (c) 2017 University of Padova
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 2 as
 * published by the Free Software Foundation;
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 *
 * Author: Davide Magrin <magrinda@dei.unipd.it>
 */

#ifndef NA_FORWARDER_H
#define NA_FORWARDER_H

#include "ns3/application.h"
#include "ns3/lora-net-device.h"
#include "ns3/gateway-lorawan-mac.h"
#include "ns3/lora-device-address.h"
#include "ns3/point-to-point-net-device.h"
#include "ns3/point-to-point-net-device.h"
#include "ns3/nstime.h"
#include "ns3/attribute.h"

namespace ns3 {
namespace lorawan {

struct deviceData_t {
  int64_t savedAt;
  uint8_t priority;
  int maxPackets;
  int32_t budget;
  Time lastOkPacketAt;
  bool isBestGateway;
};

/**
 * This application forwards packets between NetDevices:
 * LoraNetDevice -> PointToPointNetDevice and vice versa.
 */
class NA_Forwarder : public Application
{
public:
  /**
   * Callback type for filtering packets at gateway level
   */
  typedef Callback<bool, Ptr<NA_Forwarder>, Ptr<const Packet>> GatewayFilterTxCallback;

  NA_Forwarder ();
  ~NA_Forwarder ();

  static TypeId GetTypeId (void);

  /**
   * Sets the device to use to communicate with the EDs.
   *
   * \param loraNetDevice The LoraNetDevice on this node.
   */
  void SetLoraNetDevice (Ptr<LoraNetDevice> loraNetDevice);

  /**
   * Sets the P2P device to use to communicate with the NS.
   *
   * \param pointToPointNetDevice The P2PNetDevice on this node.
   */
  void SetPointToPointNetDevice (Ptr<PointToPointNetDevice> pointToPointNetDevice);

  /**
   * Receive a packet from the LoraNetDevice.
   *
   * \param loraNetDevice The LoraNetDevice we received the packet from.
   * \param packet The packet we received.
   * \param protocol The protocol number associated to this packet.
   * \param sender The address of the sender.
   * \returns True if we can handle the packet, false otherwise.
   */
  bool ReceiveFromLora (Ptr<NetDevice> loraNetDevice, Ptr<const Packet> packet,
                        uint16_t protocol, const Address& sender);

  /**
   * Receive a packet from the PointToPointNetDevice
   */
  bool ReceiveFromPointToPoint (Ptr<NetDevice> pointToPointNetDevice,
                                Ptr<const Packet> packet, uint16_t protocol,
                                const Address& sender);

  /**
   * Start the application
   */
  void StartApplication (void);

  /**
   * Stop the application
   */
  void StopApplication (void);

  void SetGatewayFilterTxCallback (GatewayFilterTxCallback callback);

  // Add LoRa End Device DevAddr to the Gateway Address Table
  void AddEndDevice (LoraDeviceAddress edAddress,
                     uint8_t priority,
                     int32_t budget,
                     int maxPackets);

  void SetAsBestGateway (LoraDeviceAddress edAddress);

  std::map<uint32_t, deviceData_t> * GetAddressTable();

private:
  Ptr<LoraNetDevice> m_loraNetDevice; //!< Pointer to the node's LoraNetDevice

  Ptr<PointToPointNetDevice> m_pointToPointNetDevice; //!< Pointer to the
  //!P2PNetDevice we use to
  //!communicate with the NS

  GatewayFilterTxCallback m_gatewayFilterTxCallback;

  std::map<uint32_t, deviceData_t> m_addressTable;
};

} //namespace ns3

}
#endif /* NA_FORWARDER */
