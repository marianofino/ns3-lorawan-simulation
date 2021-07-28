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

#include "ns3/na-forwarder.h"
#include "ns3/log.h"

namespace ns3 {
namespace lorawan {

NS_LOG_COMPONENT_DEFINE ("NA_Forwarder");

NS_OBJECT_ENSURE_REGISTERED (NA_Forwarder);

TypeId
NA_Forwarder::GetTypeId (void)
{
  static TypeId tid = TypeId ("ns3::NA_Forwarder")
    .SetParent<Application> ()
    .AddConstructor<NA_Forwarder> ()
    .SetGroupName ("lorawan");
  return tid;
}

NA_Forwarder::NA_Forwarder ()
{
  NS_LOG_FUNCTION_NOARGS ();
}

NA_Forwarder::~NA_Forwarder ()
{
  NS_LOG_FUNCTION_NOARGS ();
}

void
NA_Forwarder::SetPointToPointNetDevice (Ptr<PointToPointNetDevice>
                                     pointToPointNetDevice)
{
  NS_LOG_FUNCTION (this << pointToPointNetDevice);

  m_pointToPointNetDevice = pointToPointNetDevice;
}

void
NA_Forwarder::SetLoraNetDevice (Ptr<LoraNetDevice> loraNetDevice)
{
  NS_LOG_FUNCTION (this << loraNetDevice);

  m_loraNetDevice = loraNetDevice;
}

bool
NA_Forwarder::ReceiveFromLora (Ptr<NetDevice> netDevice, Ptr<const Packet>
                            packet, uint16_t protocol, const Address& sender)
{
  NS_LOG_FUNCTION (this << packet << protocol << sender);

  if (m_gatewayFilterTxCallback(this, packet)) {
    Ptr<Packet> packetCopy = packet->Copy ();
    m_pointToPointNetDevice->Send (packetCopy,
                                   m_pointToPointNetDevice->GetBroadcast (),
                                   0x800);
  }

  return true;
}

bool
NA_Forwarder::ReceiveFromPointToPoint (Ptr<NetDevice> pointToPointNetDevice,
                                    Ptr<const Packet> packet, uint16_t protocol,
                                    const Address& sender)
{
  NS_LOG_FUNCTION (this << packet << protocol << sender);

  Ptr<Packet> packetCopy = packet->Copy ();

  m_loraNetDevice->Send (packetCopy);

  return true;
}

void
NA_Forwarder::StartApplication (void)
{
  NS_LOG_FUNCTION (this);

  // TODO Make sure we are connected to both needed devices
}

void
NA_Forwarder::StopApplication (void)
{
  NS_LOG_FUNCTION_NOARGS ();

  // TODO Get rid of callbacks
}

void
NA_Forwarder::SetGatewayFilterTxCallback (GatewayFilterTxCallback callback)
{
  NS_LOG_FUNCTION (this << &callback);
  NS_ASSERT (!callback.IsNull ());
  m_gatewayFilterTxCallback = callback;
}

void
NA_Forwarder::AddEndDevice (LoraDeviceAddress edAddress,
                            uint8_t priority,
                            int32_t budget,
                            int maxPackets)
{
  // TODO The timestamp should come from network server
  // TODO Check if address was not inserted before and timestamp is bigger than current one

  deviceData_t device;
  device.savedAt = Simulator::Now().GetMilliSeconds();
  device.lastOkPacketAt = Time();
  device.priority = priority;
  device.maxPackets = maxPackets;
  device.budget = budget;
  device.isBestGateway = false;

  m_addressTable.insert (std::pair<uint32_t, deviceData_t>
                                  (edAddress.Get(), device));

  NS_LOG_FUNCTION (this << edAddress << edAddress.Get());
}

void
NA_Forwarder::SetAsBestGateway (LoraDeviceAddress edAddress)
{
  const auto it = m_addressTable.find (edAddress.Get());
  if (it != m_addressTable.end())
  {
    it->second.isBestGateway = true;
  }
}

std::map<uint32_t, deviceData_t> *
NA_Forwarder::GetAddressTable()
{
  return &m_addressTable;
}

}
}
