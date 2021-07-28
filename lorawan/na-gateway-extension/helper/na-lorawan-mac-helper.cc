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

#include "ns3/na-lorawan-mac-helper.h"
#include "ns3/gateway-lora-phy.h"
#include "ns3/end-device-lora-phy.h"
#include "ns3/lora-net-device.h"
#include "ns3/log.h"
#include "ns3/random-variable-stream.h"

namespace ns3 {
namespace lorawan {

NS_LOG_COMPONENT_DEFINE ("NA_LorawanMacHelper");


std::vector<int>
NA_LorawanMacHelper::SetSpreadingFactorsUp (NodeContainer endDevices, NodeContainer gateways,
                                         Ptr<LoraChannel> channel,
                                         OnBestGatewayFoundCallback m_onBestGatewayFoundCallback)
{
  NS_LOG_FUNCTION_NOARGS ();

  std::vector<int> sfQuantity (7, 0);
  for (NodeContainer::Iterator j = endDevices.Begin (); j != endDevices.End (); ++j)
    {
      Ptr<Node> object = *j;
      Ptr<MobilityModel> position = object->GetObject<MobilityModel> ();
      NS_ASSERT (position != 0);
      Ptr<NetDevice> netDevice = object->GetDevice (0);
      Ptr<LoraNetDevice> loraNetDevice = netDevice->GetObject<LoraNetDevice> ();
      NS_ASSERT (loraNetDevice != 0);
      Ptr<ClassAEndDeviceLorawanMac> mac =
          loraNetDevice->GetMac ()->GetObject<ClassAEndDeviceLorawanMac> ();
      NS_ASSERT (mac != 0);

      LoraDeviceAddress edAddress = mac->GetDeviceAddress();

      // Try computing the distance from each gateway and find the best one
      Ptr<Node> bestGateway = gateways.Get (0);
      Ptr<MobilityModel> bestGatewayPosition = bestGateway->GetObject<MobilityModel> ();

      //bestGateway->GetDevice (0)->GetObject<LoraNetDevice>()->GetMac()->GetObject<GatewayLorawanMac>()->AddEndDevice(devAddr);

      // Assume devices transmit at 14 dBm
      double highestRxPower = channel->GetRxPower (14, position, bestGatewayPosition);

      for (NodeContainer::Iterator currentGw = gateways.Begin () + 1; currentGw != gateways.End ();
           ++currentGw)
        {
          // Compute the power received from the current gateway
          Ptr<Node> curr = *currentGw;
          Ptr<MobilityModel> currPosition = curr->GetObject<MobilityModel> ();
          double currentRxPower = channel->GetRxPower (14, position, currPosition); // dBm

          if (currentRxPower > highestRxPower)
            {
              bestGateway = curr;
              bestGatewayPosition = curr->GetObject<MobilityModel> ();
              highestRxPower = currentRxPower;
            }

          //curr->GetDevice (0)->GetObject<LoraNetDevice>()->GetMac()->GetObject<GatewayLorawanMac>()->AddEndDevice(devAddr);
        }

      m_onBestGatewayFoundCallback(bestGateway, edAddress);
      //bestGateway->GetDevice (0)->GetObject<LoraNetDevice>()->GetMac()->GetObject<GatewayLorawanMac>()->AddEndDevice(mac->GetDeviceAddress());
      // Add device data needed for NA to gateways
      //bestGateway->GetDevice (0)->GetObject<LoraNetDevice>()->GetMac()->GetObject<GatewayLorawanMac>()->SetAsBestGateway(devAddr);

      // NS_LOG_DEBUG ("Rx Power: " << highestRxPower);
      double rxPower = highestRxPower;

      // Get the ED sensitivity
      Ptr<EndDeviceLoraPhy> edPhy = loraNetDevice->GetPhy ()->GetObject<EndDeviceLoraPhy> ();
      const double *edSensitivity = edPhy->sensitivity;

      if (rxPower > *edSensitivity)
        {
          mac->SetDataRate (5);
          sfQuantity[0] = sfQuantity[0] + 1;
        }
      else if (rxPower > *(edSensitivity + 1))
        {
          mac->SetDataRate (4);
          sfQuantity[1] = sfQuantity[1] + 1;
        }
      else if (rxPower > *(edSensitivity + 2))
        {
          mac->SetDataRate (3);
          sfQuantity[2] = sfQuantity[2] + 1;
        }
      else if (rxPower > *(edSensitivity + 3))
        {
          mac->SetDataRate (2);
          sfQuantity[3] = sfQuantity[3] + 1;
        }
      else if (rxPower > *(edSensitivity + 4))
        {
          mac->SetDataRate (1);
          sfQuantity[4] = sfQuantity[4] + 1;
        }
      else if (rxPower > *(edSensitivity + 5))
        {
          mac->SetDataRate (0);
          sfQuantity[5] = sfQuantity[5] + 1;
        }
      else // Device is out of range. Assign SF12.
        {
          // NS_LOG_DEBUG ("Device out of range");
          mac->SetDataRate (0);
          sfQuantity[6] = sfQuantity[6] + 1;
          // NS_LOG_DEBUG ("sfQuantity[6] = " << sfQuantity[6]);
        }

      /*

      // Get the Gw sensitivity
      Ptr<NetDevice> gatewayNetDevice = bestGateway->GetDevice (0);
      Ptr<LoraNetDevice> gatewayLoraNetDevice = gatewayNetDevice->GetObject<LoraNetDevice> ();
      Ptr<GatewayLoraPhy> gatewayPhy = gatewayLoraNetDevice->GetPhy ()->GetObject<GatewayLoraPhy> ();
      const double *gwSensitivity = gatewayPhy->sensitivity;

      if(rxPower > *gwSensitivity)
        {
          mac->SetDataRate (5);
          sfQuantity[0] = sfQuantity[0] + 1;

        }
      else if (rxPower > *(gwSensitivity+1))
        {
          mac->SetDataRate (4);
          sfQuantity[1] = sfQuantity[1] + 1;

        }
      else if (rxPower > *(gwSensitivity+2))
        {
          mac->SetDataRate (3);
          sfQuantity[2] = sfQuantity[2] + 1;

        }
      else if (rxPower > *(gwSensitivity+3))
        {
          mac->SetDataRate (2);
          sfQuantity[3] = sfQuantity[3] + 1;
        }
      else if (rxPower > *(gwSensitivity+4))
        {
          mac->SetDataRate (1);
          sfQuantity[4] = sfQuantity[4] + 1;
        }
      else if (rxPower > *(gwSensitivity+5))
        {
          mac->SetDataRate (0);
          sfQuantity[5] = sfQuantity[5] + 1;

        }
      else // Device is out of range. Assign SF12.
        {
          mac->SetDataRate (0);
          sfQuantity[6] = sfQuantity[6] + 1;

        }
        */

    } // end loop on nodes

  return sfQuantity;

} //  end function

} // namespace lorawan
} // namespace ns3
