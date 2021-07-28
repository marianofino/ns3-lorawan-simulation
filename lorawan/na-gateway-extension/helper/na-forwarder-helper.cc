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

#include "ns3/na-forwarder-helper.h"
#include "ns3/random-variable-stream.h"
#include "ns3/double.h"
#include "ns3/string.h"
#include "ns3/trace-source-accessor.h"
#include "ns3/simulator.h"
#include "ns3/log.h"

namespace ns3 {
namespace lorawan {

NS_LOG_COMPONENT_DEFINE ("NA_ForwarderHelper");

NA_ForwarderHelper::NA_ForwarderHelper ()
{
  m_factory.SetTypeId ("ns3::NA_Forwarder");
}

NA_ForwarderHelper::~NA_ForwarderHelper ()
{
}

void
NA_ForwarderHelper::SetAttribute (std::string name, const AttributeValue &value)
{
  m_factory.Set (name, value);
}

ApplicationContainer
NA_ForwarderHelper::Install (Ptr<Node> node) const
{
  return ApplicationContainer (InstallPriv (node));
}

ApplicationContainer
NA_ForwarderHelper::Install (NodeContainer c) const
{
  ApplicationContainer apps;
  for (NodeContainer::Iterator i = c.Begin (); i != c.End (); ++i)
    {
      apps.Add (InstallPriv (*i));
    }

  return apps;
}

Ptr<Application>
NA_ForwarderHelper::InstallPriv (Ptr<Node> node) const
{
  NS_LOG_FUNCTION (this << node);

  Ptr<NA_Forwarder> app = m_factory.Create<NA_Forwarder> ();

  app->SetNode (node);
  node->AddApplication (app);

  // Link the NA_Forwarder to the NetDevices
  for (uint32_t i = 0; i < node->GetNDevices (); i++)
    {
      Ptr<NetDevice> currentNetDevice = node->GetDevice (i);
      if (currentNetDevice->GetObject<LoraNetDevice> () != 0)
        {
          Ptr<LoraNetDevice> loraNetDevice =
            currentNetDevice->GetObject<LoraNetDevice> ();
          app->SetLoraNetDevice (loraNetDevice);
          loraNetDevice->SetReceiveCallback (MakeCallback
                                               (&NA_Forwarder::ReceiveFromLora, app));
        }
      else if (currentNetDevice->GetObject<PointToPointNetDevice> () != 0)
        {
          Ptr<PointToPointNetDevice> pointToPointNetDevice =
            currentNetDevice->GetObject<PointToPointNetDevice> ();

          app->SetPointToPointNetDevice (pointToPointNetDevice);

          pointToPointNetDevice->SetReceiveCallback (MakeCallback
                                                       (&NA_Forwarder::ReceiveFromPointToPoint,
                                                       app));
        }
      else
        {
          NS_LOG_ERROR ("Potential error: NetDevice is neither Lora nor PointToPoint");
        }
    }

  return app;
}

}
} // namespace ns3
