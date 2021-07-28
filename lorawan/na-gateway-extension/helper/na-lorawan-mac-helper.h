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

#ifndef NA_LORAWAN_MAC_HELPER_H
#define NA_LORAWAN_MAC_HELPER_H

#include "ns3/net-device.h"
#include "ns3/lora-channel.h"
#include "ns3/lora-phy.h"
#include "ns3/lorawan-mac.h"
#include "ns3/lorawan-mac-helper.h"
#include "ns3/class-a-end-device-lorawan-mac.h"
#include "ns3/lora-device-address-generator.h"
#include "ns3/gateway-lorawan-mac.h"
#include "ns3/node-container.h"
#include "ns3/random-variable-stream.h"

namespace ns3 {
namespace lorawan {

class NA_LorawanMacHelper : public LorawanMacHelper
{
public:
  /**
   * Callback type for getting best gateway with Rx Power
   */
  typedef Callback<void, Ptr<Node>, LoraDeviceAddress> OnBestGatewayFoundCallback;

  /**
   * Set up the end device's data rates
   * This function assumes we are using the following convention:
   * SF7 -> DR5
   * SF8 -> DR4
   * SF9 -> DR3
   * SF10 -> DR2
   * SF11 -> DR1
   * SF12 -> DR0
   */
  static std::vector<int> SetSpreadingFactorsUp (NodeContainer endDevices, NodeContainer gateways,
                                                 Ptr<LoraChannel> channel,
                                                 OnBestGatewayFoundCallback m_onBestGatewayFoundCallback);

//private:
};

} // namespace lorawan

} // namespace ns3
#endif /* LORA_PHY_HELPER_H */
