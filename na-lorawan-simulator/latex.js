%\documentclass{llncs}
%\documentclass[10pt,journal,compsoc]{IEEEtran}
% *** CITATION PACKAGES ***
%
\documentclass[journal]{IEEEtran}
\usepackage{cite}
% *** GRAPHICS RELATED PACKAGES ***
%
\ifCLASSINFOpdf
   \usepackage[pdftex]{graphicx}
  % declare the path(s) where your graphic files are
  % \graphicspath{{../pdf/}{../jpeg/}}
  % and their extensions so you won't have to specify these with
  % every instance of \includegraphics
  % \DeclareGraphicsExtensions{.pdf,.jpeg,.png}
\else
  % or other class option (dvipsone, dvipdf, if not using dvips). graphicx
  % will default to the driver specified in the system graphics.cfg if no
  % driver is specified.
   \usepackage[dvips]{graphicx}
  % declare the path(s) where your graphic files are
  % \graphicspath{{../eps/}}
  % and their extensions so you won't have to specify these with
  % every instance of \includegraphics
  % \DeclareGraphicsExtensions{.eps}
\fi
\usepackage{cite}
\usepackage[utf8]{inputenc}
\usepackage{multirow} % http://ctan.org/pkg/multirow
\usepackage{hhline} % http://ctan.org/pkg/hhline
\usepackage{multicol}
\usepackage{blindtext}
\usepackage{array}
\usepackage{mdwtab} 
%\usepackage[tight,footnotesize]{subfig}
\usepackage{fixltx2e}
\usepackage{url}
\usepackage{flushend}
\usepackage{graphicx}
\usepackage[caption=false]{subfig}
\usepackage{color}
\usepackage{amsmath}
\usepackage{multirow,booktabs}
\usepackage{bibnames}
\usepackage{todonotes}
\usepackage{float}
\floatstyle{plaintop}
\restylefloat{table}
\usepackage[english]{babel}
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage{tabularx}
%\selectlanguage{english}
\usepackage{caption}

\captionsetup[table]{
  labelsep=newline,
  labelfont=sc,
  justification=centering,
  singlelinecheck=false,
}
\usepackage{lettrine}
\usepackage{scalerel}
\usepackage{tikz}
\usetikzlibrary{svg.path}

\definecolor{orcidlogocol}{HTML}{A6CE39}
\tikzset{
  orcidlogo/.pic={
    \fill[orcidlogocol] svg{M256,128c0,70.7-57.3,128-128,128C57.3,256,0,198.7,0,128C0,57.3,57.3,0,128,0C198.7,0,256,57.3,256,128z};
    \fill[white] svg{M86.3,186.2H70.9V79.1h15.4v48.4V186.2z}
                 svg{M108.9,79.1h41.6c39.6,0,57,28.3,57,53.6c0,27.5-21.5,53.6-56.8,53.6h-41.8V79.1z M124.3,172.4h24.5c34.9,0,42.9-26.5,42.9-39.7c0-21.5-13.7-39.7-43.7-39.7h-23.7V172.4z}
                 svg{M88.7,56.8c0,5.5-4.5,10.1-10.1,10.1c-5.6,0-10.1-4.6-10.1-10.1c0-5.6,4.5-10.1,10.1-10.1C84.2,46.7,88.7,51.3,88.7,56.8z};
  }
}

\newcommand\orcidicon[1]{\href{https://orcid.org/#1}{\mbox{\scalerel*{
\begin{tikzpicture}[yscale=-1,transform shape]
\pic{orcidlogo};
\end{tikzpicture}
}{|}}}}

\usepackage{hyperref} %<--- Load after everything else

% *** MATH PACKAGES ***
%
%\usepackage[cmex10]{amsmath}

% *** SPECIALIZED LIST PACKAGES ***
%
%\usepackage{algorithmic}

% *** ALIGNMENT PACKAGES ***
%
%\usepackage{array}

% *** SUBFIGURE PACKAGES ***
%\ifCLASSOPTIONcompsoc
%\usepackage{subfig}
%\usepackage{subfigure}
%\else
 \usepackage{flushend}

%\fi

% *** PDF, URL AND HYPERLINK PACKAGES ***
%
%\usepackage{url}
% url.sty was written by Donald Arseneau. It provides better support for
% handling and breaking URLs. url.sty is already installed on most LaTeX
% systems. The latest version and documentation can be obtained at:
% http://www.ctan.org/tex-archive/macros/latex/contrib/url/
% Basically, \url{my_url_here}.

\hyphenation{op-tical net-works semi-conduc-tor}

\usepackage{multirow}
\usepackage{soul}
\usepackage{xcolor}
\widowpenalty10000
\clubpenalty10000
%orcid gabriel
%https://orcid.org/0000-0002-4328-0183
%orcid rodrigo
%https://orcid.org/0000-0003-0382-477X
%orcid matias
%https://orcid.org/0000-0002-1891-3137
%orcid leo
%https://orcid.org/0000-0003-2237-812X

\begin{document}
\title{NA-LoRaWAN: gateway description for small private networks}
\author{Finochietto et al}

\maketitle

%
% author names and IEEE memberships
% note positions of commas and nonbreaking spaces ( ~ ) LaTeX will not break
% a structure at a ~ so this keeps an author's name from being broken across
% two lines.
% use \thanks{} to gain access to the first footnote area
% a separate \thanks must be used for each paragraph as LaTeX2e's \thanks
% was not built to handle multiple paragraphs
%


%\IEEEauthorblockA{
%\IEEEauthorrefmark{2}\emph{Laboratorio de Investigación en Informática (LINVI), Departamento de Informática, \\}
%}
%\IEEEauthorblockA{\emph{UNPSJB, Bvd Brown 3050, 9120, Puerto Madryn, Chubut, Argentina}\\
%$^1$\texttt{\small{leo.ordinez@gmail.com}\\}}

%\IEEEauthorblockA{
%\IEEEauthorrefmark{1}\emph{Dep. de Ing. Eléctrica y Computadoras, Instituto de Ciencias e Ingeniería de Computación, \\}
%}
%\IEEEauthorblockA{\emph{UNS-CONICET, San Andrés 800, 8000 Bahia Blanca, Argentina}\\
%$^2$\texttt{\small{gmeggly@uns.edu.ar}}, 
%$^3$\texttt{\small{matias.micheletto@uns.edu.ar}}, 
%$^4$\texttt{\small{ierms@criba.edu.ar}}}}

% note the % following the last \IEEEmembership and also \thanks - 
% these prevent an unwanted space from occurring between the last author name
% and the end of the author line. i.e., if you had this:
% 
% \author{....lastname \thanks{...} \thanks{...} }
%                     ^------------^------------^----Do not want these spaces!
%
% a space would be appended to the last name and could cause every name on that
% line to be shifted left slightly. This is one of those "LaTeX things". For
% instance, "\textbf{A} \textbf{B}" will typeset as "A B" not "AB". To get
% "AB" then you have to do: "\textbf{A}\textbf{B}"
% \thanks is no different in this regard, so shield the last } of each \thanks
% that ends a line with a % and do not let a space in before the next \thanks.
% Spaces after \IEEEmembership other than the last one are OK (and needed) as
% you are supposed to have spaces between the names. For what it is worth,
% this is a minor point as most people would not even notice if the said evil
% space somehow managed to creep in.



% The paper headers
%\markboth{Embedded Systems Letters,~Vol.~XX, No.~YY, September~20ZZ}%
%{Santos \MakeLowercase{\textit{et al.}}: Using open hardware in a harsh environment}
% The only time the second header will appear is for the odd numbered pages
% after the title page when using the twoside option.
% 
% *** Note that you probably will NOT want to include the author's ***
% *** name in the headers of peer review papers.                   ***
% You can use \ifCLASSOPTIONpeerreview for conditional compilation here if
% you desire.




% If you want to put a publisher's ID mark on the page you can do it like
% this:
%\IEEEpubid{0000--0000/00\$00.00~\copyright~2014 IEEE}
% Remember, if you use this you must call \IEEEpubidadjcol in the second
% column for its text to clear the IEEEpubid mark.



% use for special paper notices
%\IEEEspecialpapernotice{(Invited Paper)}




% make the title area
%\onecolumn
%\input{respuesta.tex}
%\twocolumn
\maketitle

\begin{abstract}
%LoRa has become the ... however its used in real-time communications is not contemplated as the MAC protocol and network operation is not oriented...
LoRaWAN has become the most widely used Low Power Wide Area Network (LPWAN) technology in Latin America providing connectivity for what is called the Internet of Remote Things (IoRT). However, its use still presents some problems as it depends on the access to a network backhaul usually provided by mobile phone companies or satellite connections. In this paper, an extension to the basic LoRaWAN protocol is presented to reduce duplicate traffic in the backhaul network and with this an important reduction in costs based on the introduction of a Software Defined Network (SDN) controller at the Network Server level. The extension is named NA-LoRaWAN and stands for Node-Aware. A complete description of the proposal is presented and simulations performed with NS3 show an average traffic reduction of 9\%.
\end{abstract}

\begin{keywords}
\end{keywords}

\section{Introduction}
Connecting to Internet devices which are operating in remote undeveloped areas, is a branch of the Internet of Things known as the Internet of Remote Things (IoRT)\cite{sanctis}. Some IoRT applications include agriculture (e.g. sensors may be installed in a field in order to monitor crops), environmental monitoring (e.g. outdoor monitoring to detect avalanches or volcanoes eruptions) and oil platforms (e.g. measure machinery performance to predict potential failures). Although there are a lot of different use cases, many of these deployments consist of just a few hundreds of devices dispersed over wide geographical areas, far away from urban centers. 

In IoRT applications, the terrestrial telecommunication infrastructure is usually unstable or 
non-existent. This gets worse in developing countries, where the options may be limited to obsolete cellular connectivity (e.g. 2G) or satellite communications. And even if network infrastructure is available at the site, the IoT application may require, depending on its criticality, a backhaul which does not get affected by service interruptions caused by, for example, harsh environmental conditions. In these cases, satellite communications facilitate the creation of alternative networks that may solve this lack of terrestrial connectivity\cite{sanctis}. However, satellite IoT and other alternative IoT networks providers usually offer a limited bandwidth service (e.g. a fixed messages or MB per month) and/or are more expensive than common services used in urban areas, such as modern cellular technologies or optical fiber provided by ISPs in cities.

LPWANs such as Sigfox, NB-IoT or LoRaWAN seem to be suitable options for this kind of network.  They enable low-power consumption devices, which is a key feature since a stable source of energy may not be available, and with very little infrastructure they can offer communication coverage to a wide area (one gateway can easily reach the 10km link range)\cite{surveylpwan}. Since LoRaWAN is an open protocol that allows private deployments, it has the advantage over the other two that it does not depend on third-party concentrators or gateways. This is especially important considering the fact that due to the small number of devices connected to the network, it may not be interesting, from a business point of view, for network providers to supply gateways to these areas.

Although LoRaWAN specifications assume backhaul is IP compatible, it can potentially work with other protocols. However, when working with limited backhaul networks like the ones that may be found in IoRT, it presents some challenges. For example, almost all of the network decisions take place in the LoRaWAN Network Server, commonly deployed in the cloud. This means that most of the traffic is forwarded through the backhaul, even if it may be discarded once it arrives at the Network Server or the application. Moreover, LoRaWAN does not contemplate that there may be some packets or nodes which should have more priority than others, which becomes significant when the backhaul bandwidth is limited to a fixed amount of messages in a period.

\textit{Contribution:} In this work, it is proposed a LoRaWAN gateway which aims to reduce the traffic sent to the network backhaul by filtering packets locally. It is designed in the context of small private LoRaWAN networks with limited backhauls and fixed (or with limited mobility) End Devices, like the ones that could be found in IoRT.

\textit{Organization:} The rest of the paper is organized as follows. The next two sections, \ref{sec_lora_overview} and \ref{sec_prev_works}, briefly introduces the LoRaWAN technology and describe related works. Section \ref{sec_nodeaware} describes the basics of the gateway proposed. Section \ref{sec_apps} provides a set of example applications that could be developed in order to process traffic in different ways. In Section \ref{sec_design}, a design for one of the applications presented is described in detail. Section \ref{sec_sim} contains the results of the performance evaluation, which shows how one of the applications presented would compare with traditional standard gateways, and explains how the simulation was made. Finally, Section \ref{sec_conc} concludes this work.

%% TODO AGREGAR DESCRIPCION DE SECCIONES

\section{LoRaWAN Overview}\label{sec_lora_overview}

LoRaWAN is a communication protocol designed to connect IoT devices to a backend in the cloud. It is composed of a physical layer, which uses a radio modulation called LoRa, patented by Semtech and based on chirp spread spectrum, and a MAC layer which defines an open source networking protocol.

Depending on the implementation, there are usually 4 key elements in a LoRaWAN network:

\begin{enumerate}
  \item \textit{End Devices:} are the sensors or actuators that receive and transmit to the gateways using LoRa modulation.
  \item \textit{Gateways:} are the edge nodes, which forward packets between End Devices and Network Server. They act as a bridge between the LoRa radio and the backhaul protocol.
  \item \textit{Network Server:} in charge of the whole network management. It may include the Join Server, which is in charge of registering End Devices in the network.
  \item \textit{Application Server:} manages sensor/actuator application data. 
\end{enumerate}

Activation of End Devices in the network is either done by ABP (Activation By Personalization) or OTAA (Over-The-Air Activation). In ABP, the device has already configured a fixed address and session keys (needed to establish communication) before installation. In OTAA, these are dynamically assigned in a process called Join Procedure, by the Join Server.

\section{Previous Works}\label{sec_prev_works}

The challenges of adapting LoRaWAN to networks with limited backhaul has been treated in different works. In \cite{palattella} they focus on satellite communications and present three main issues: the network latency which may be greater than ACK timeouts, packet duplication which may load the backhaul with multiple copies of the same message, and the data overhead that serialization protocols at application layer introduce (like JSON). The latter one is also analyzed in \cite{Lysogor2018} and \cite{Lysogor2019} , where they propose a compression technique for messages transmitted through the backhaul based in Protocol Buffers.

In \cite{holik} a LoRa-SDN architecture is introduced which sets the basis for processing packets at gateway level. Software Defined Networks (SDN) is a layered architecture software system which aims to make network administration easier and more scalable. In this model, an SDN Switch, which is a software that runs on network switches, is installed in a LoRa gateway in order to filter packets. An SDN Controller is installed together with the Network Server so it can synchronize the SDN Switches. Even if the general model may work with LoRa, its design is not compatible with LoRaWAN, since it assumes it can filter nodes at gateway level, which cannot be done unless a modification to the protocol is proposed.

Fog computing in LoRaWAN has also been subject of intense research. Authors in \cite{Jalowiczor2021}, \cite{Barro2019} and \cite{Barro20192} propose, in summary, two groups of architectures which, even if valid, are not addressed in this work. In the first one, the LoRaWAN Network and Application security keys need to be downloaded to the gateways, so they can access packet’s data, but it presents some risks since it compromises the system security. In the second one, some components of the whole application stack are installed in the gateways in the field, like the LoRaWAN Network Server and application databases. Depending on the requirements, this may not seem suitable for some IoRT applications, since concentrating computing power in the cloud is generally cheaper and more easy to maintain and upgrade. Moreover, having a thick layer of processing in the gateways would require more computational resources and higher energy consumption in the field.

Other works, like \cite{Dawaliby2019} and  \cite{Lima2021} aim to optimize traffic and devices energy consumption by assigning QoS to the nodes depending on application requirements. They mainly focus on adjusting the settings of the radio portion of the network, which is out of the scope of this article.

In \cite{Finochietto2019} the authors propose an agent which processes each packet in an intermediate node, after it has been sent, and before arriving at the destination. This agent is able to filter, aggregate or transform data dynamically. Although it is in the context of real-time communications and for other communication protocols, the basic principles are similar to the ones introduced in this work.


\section{NA-LoRaWAN gateway}\label{sec_nodeaware}
The NA-LoRaWAN gateway proposed in this work differs from a traditional ones because it is able to process traffic based on the transmitting End Device. We refer to this characteristic as ``Node-Aware''. For a gateway to be NA, it needs first to uniquely identify which node has sent an incoming packet, and then apply a set of rules to decide what must be done with this packet --- either forward it or discard it.

\subsection{Node identification}
By protocol design, there is no standard way for a gateway in LoRaWAN to associate a packet with a unique End Device. This job is done by the Network Server, in a process that matches each message cryptographic signature to a device in a backend database. Since the gateway does not know the cryptographic key used (Network Session Key) and does not have access to the device database, it cannot match the message with a device. Another alternative for the gateway would be to use the DevEUI, which is a unique identifier assigned by the chip manufacturer (similar to a MAC address). However, as it is only sent during the join process in OTAA \textcolor{red}{ que es OTAA}, it will not be accessible again in future packets neither in OTAA nor in ABP \textcolor{red}{que es  ABP}, and hence, the gateway will not know the DevEUI of each incoming data packet. Finally, there is the DevAddr which is an address either hardcoded in the device (ABP) or assigned by the Network Server (OTAA). It is ephemeral and not unique, so there may be a lot of devices with the same DevAddr in the same network, which makes it useless to identify nodes. Still, if the DevAddr assignment process is changed in order to guarantee that it is unique per device, then, in some scenarios as the ones targeted by this work, this attribute would be sufficient as it is present on every packet that passes through the gateway. This solution would only be useful in those networks where the nodes have none or little mobility (within the coverage of the same gateway).

A LoRaWAN DevAddr is a 32-bit address composed of a NetID Type prefix, a NwkID and a NwkAddr. In private networks, there is space to 25-bits of unique NwkAddr \cite{lorawan_backend} \cite{lorawan_spec}, resulting in millions of available addresses. This is more than enough for just a few hundreds of nodes like the networks targeted in this work.

For OTAA, if the Network Server uniformly assigns the DevAddr then the uniqueness of the DevAddr is achieved. Once the limit of DevAddr is reached, the Network Server ends the oldest sessions (e.g. a small percentage of the total addresses assigned) so it removes potential inactive nodes while freeing some space in order to accept new ones. 

For ABP, no changes are required since the DevAddr is manually assigned. However, device integrators should take special care into account in order not to overlap devices with the same DevAddr.

This solution would make roaming unusable, since LoRaWAN roaming does not support private networks. Nevertheless, for the IoRT use cases targeted by this work, this may be an advantage since it facilitates the control of the traffic being sent to the backhaul.

\subsection{Gateway-Network Server architecture}

A simple SDN-inspired approach is taken in order to redesign the interaction between the gateways and the Network Server. A reference architecture diagram is shown in Figure \ref{fig:sdn_lora}, which is based on a more complete SDN solution that can be found at \cite{holik}.

The gateways have a basic SDN switch software, which periodically receives updates of the necessary information it needs to operate. The SDN controller software is installed in a server together with the Network Server, and has the rights to read data from it.

\begin{figure}[htp]
    \centering
    \includegraphics[scale=0.35]{images_en/sdn_lora.png}
    \caption{A reference diagram of a LoRaWAN SDN architecture.}
    \label{fig:sdn_lora}
\end{figure}
\textcolor{red}{Necesita más explicación, identificar SDN como Software Defined Network}

\section{Traffic shaping policies}\label{sec_apps} 
\textcolor{red}{No me gusta el titulo de la seccion... Applications, confunde}
Identifying each packet’s node id and using the architecture proposed previously, enables a new way for the gateway to analyze and control the traffic it receives and sends. In this section, four applications to reduce the traffic sent to the backhaul are presented.

\subsection{Filtering traffic by node id}\label{subsec_filter}

Each SDN switch at the gateway could keep a local whitelist (similar to a flow table in SDN) of DevAddr to forward to the Network Server. This list will be updated by the SDN controller, by downloading a command to the gateway when a new ABP device is configured by network administrator or each time a new device concludes a successful join process in OTAA. If two gateways send a join process (OTAA) from the same device, the SDN controller will choose the one which has the lower RSS. The SDN switches inform its status periodically (e.g. once per day), and the SDN controller keeps a log of the status of all of its gateways. If a gateway fails to inform its status and it is not sending packets anymore, the SDN controller could migrate or distribute its whitelist to nearby gateways.

By maintaining the whitelist of packets to forward, and identifying the nodes, the gateways would only transmit once each message to the Network Server, avoiding the duplication.

\subsection{Filtering traffic by node priority}

If the SDN controller associates each node to a priority level (e.g. 1 to 5, being 1 the most important one and 5 the least one), it could instruct the gateway to only forward packets from the highests priority levels when it needs to save network bandwidth. By default, every node takes the same priority and every gateway forwards all nodes no matter their priorities. However, these two properties could be changed by the network administrator. Once the priority level to forward is changed, the Network Server downloads a command to each gateway updating its settings.

\subsection{Filtering traffic by consumers}

When LoRaWAN Applications are registered, the application administrator could optionally indicate which End Devices it is going to consume and the frequency (if this information is not filled in, it assumes the application may require any device data at any time) \cite{MQTTSensors}. This information is aggregated for all devices, and downloaded to the SDN switches. If a device is not being consumed by any application, the gateway will not forward it so it does not use bandwidth with data that no consumer will need. Moreover, if a node is sending messages at a higher frequency than the one that an application is able to consume, the gateway can filter those extra packets locally.

\begin{table*}[t]
\centering
\resizebox{\textwidth}{!}{%
\begin{tabular}{|l|l|l|l|}
\hline
\textbf{NODE-AWARE VERSION (4 bits)} &
  \textbf{PACKET TYPE (4 bits)} &
  \textbf{TIMESTAMP (48 bits)} &
  \textbf{PAYLOAD (variable length)} \\ \hline
\multirow{5}{*}{0 (current version)} &
  0 (NODE-AWARE ACTIVATION) &
  \multirow{5}{*}{Milliseconds since epoch} &
  \multirow{5}{*}{\begin{tabular}[c]{@{}l@{}}Optional.\\ Contains specific data that depends\\ on the packet type.\end{tabular}} \\ \cline{2-2}
 & 1 (NODE_AWARE_\DEACTIVATION)         &  &  \\ \cline{2-2}
 & 2 (RESET)                           &  &  \\ \cline{2-2}
 & 4 (REMOVE\_DEVADDR\_WHITELIST)      &  &  \\ \cline{2-2}
 & 5 (UPDATE\_DEVADDR\_WHITELIST\_ACK) &  &  \\ \hline
\end{tabular}
}
\caption{Frames structure}
\label{tab:frame_table}
\end{table*}

\subsection{Filtering traffic by budget}\label{sec_filter_budget}

If there is no critical information being sent, the SDN controller could limit the amount of bytes sent to the backhaul, by downloading a budget in bytes to each gateway. This budget could be per node, or per gateway. Each time the gateway receives a packet, it first checks that the available budget is bigger than the packet size and then consumes from the corresponding budget the size of the packet to be sent. When the available budget is smaller than the packet size, it doesn’t forward and rejects it.

\section{Design proposal}\label{sec_design} %  & simulation
The implementation of NA-LoRaWAN requires the extension of gatewway functionalities but no modifications for the End Devices. It is for this that End Devices can work indistinctly with NA-gateways or simple gateways. At the Network Server level, some functionalities have to be added too in order to implement the NA-protocol.
%Although standard LoRaWAN End Devices doesn’t require any changes to work with Node-Aware LoRaWAN gateways, the gateways and the Network server require some few extensions. 

In this section, the changes and additions to LoRaWAN required for implementing the 4 different traffic shaping policies are described.
%Moreover, a simulation is done using NS3 to evaluate the results for a fictional IoRT use case.

%\subsection{“Filtering traffic by node id” application design proposal}

As stated earlier, the design is inspired by SDN, where there is an SDN controller alike software installed together with the Network Server, while there is an SDN switch alike software installed in each gateway. A complete description of the SDN controller-switch exchange protocol is beyond the purpose of this work but the main ideas are introduced. 
%It is not the aim of this work to provide a complete SDN solution, but take some of its concepts. 
All communication between Network Server and gateway, is done between the SDN controller and SDN switch. Besides the communication, some modifications are done in the Network Server, based on the LoRaWAN® Backend technical documents\cite{lorawan_backend}.

\subsection{Node-Aware mode activation}

LoRaWAN End Devices should be compatible with both standard and NA-gateways (\textcolor{red}{ojo dijimos que no tenian diferencias los end-devices}). This allows network designers to find the right balance between packet redundancy and traffic optimization. In the same network there could be either all standard LoRaWAN gateways, all NA-gateways, or a mix of both. Moreover, a gateway should be able to become NA on the fly, by downloading the ACTIVATION command from the Network Server. To change the mode to traditional packet forwarders, a DEACTIVATION command should be downloaded. The commands, described in Table 1, are sent from the SDN controller to the SDN switch found on the gateway.

Once a NA-gateway is deactivated, it must keep all data related to this mode stored, in case it is activated again in the future. Moreover, in both modes the gateway should process and respond to every command from the SDN controller. To empty gateway data, a RESET command should be sent as described in Table \ref{tab:frame_table}.



\begin{figure*}[t]
    \centering
    %\includegraphics[width=1.0\textwidth]{images_en/sequence.png}
    \includegraphics[scale=0.12]{images_en/sequence.png}
    \caption{Gateway whitelist update sequence.}
    \label{fig:seq}
\end{figure*}


\subsection{DevAddr Management}

It is not stated in the technical documents how the Network Server assigns a DevAddr in OTAA. Therefore, by using the NetID Type for private networks and a simple incremental approach of 1 unit starting from 0 for NwkAddr, it is guaranteed that they do not repeat. When there is no space left to add more addresses (the 25-bit of unique NwkAddr have been consumed), the Network Server should send a ForceRejoinReq message to the first few DevAddr assigned in order to check if they are still alive or not. For those who do not answer back, their DevAddr is freed and can be reused. For small networks, as the ones targeted by this work, it should not be hard to find obsolete devices out of the millions addresses that could be formed by the protocol, so the ForceRejoinReq message could be sent in batches of 10 DevAddr. For ABP devices, their addresses should be manually stored by the network admin and OTAA must avoid using them for assignments/removals.

In OTAA, each DevAddr is mapped to a NA-gateway in a process called ``Node-Gateway Assignment'', described in the Activity Diagram at Figure \ref{fig:node_gw}. NA-gateways must forward every join request received. When receiving duplicate join requests packets, the Network Server is able to evaluate, from all the gateways that transmitted the same packet, which gateway will be in charge of forwarding the corresponding End Device. First, ``Deduplication'' is applied, which is the process of  transforming duplicated packets into a single backend transmission, as stated by the LoRaWAN specification. A ``Deduplication Window'' is configured in the Network Server which states the time to wait for new equal incoming packets to be merged into one. From the duplicated packets received, the Network Servers must select the packet with the better gateway RSSI, which is similar to what ChirpStack LoRaWAN Network Server does \cite{chirpstack}. After selecting the best gateway and assigning a DevAddr as described previously, the Network Server should store in a database the DevAddr, the DevEUI, the gateway id and the last RSSI value, and then answer back to the gateway chosen. Finally, if more equal packets outside the Deduplication Window come (because of the delays of the backhaul), the Network Server should check whether their RSSI is better than the one stored, and, in that case, update the database with the new data. Each time a new packet comes, the RSSI in the database must be updated.

\begin{figure}[htp]
    \centering
    \includegraphics[scale=0.35]{images_en/node_gateway.png}
    \caption{Node-Gateway assignment process.}
    \label{fig:node_gw}
\end{figure}

In the case of ABP, the network administrator must manually assign in the database DevAddr to gateways.

Once a DevAddr has been mapped to one gateway id (either automatically in OTAA or manually in ABP), the gateways involved must update their DevAddr whitelist. For OTAA, this process is described in Figure \ref{fig:seq}. First, the Network Server must communicate to the SDN controller to update the gateway whitelist. Next, the SDN controller has to download to the gateway SDN switch a special packet called ADD\_DEVADDR\_WHITELIST, which has the frame structure described in Table \ref{tab:frame_table}. As packet payload, it should send the DevAddr. Once the SDN switch receives the packet, it should store it in non-volatile memory, in a dictionary-like structure containing the DevAddr mapped to a timestamp. For every update done on the whitelist concerning a DevAddr, it should verify first that the packet timestamp is bigger than the one stored; otherwise it should discard it. For the case that the Network Server migrates the DevAddr to a new gateway, the SDN controller sends a REMOVE\_DEVADDR\_WHITELIST (Table \ref{tab:frame_table}) packet with the DevAddr to the old gateway, and after receiving an ACK, sends a ADD\_DEVADDR\_WHITELIST packet to the new gateway with the DevAddr information. In this way, the old gateway will remove first the DevAddr from the whitelist, and the new gateway will add it. Potentially, since there could be a packet loss, this order could be changed: first add the DevAddr in the new gateway and then remove it from the old one.

To acknowledge reception, the SDN switch sends an UPDATE\_DEVADDR\_WHITELIST\_ACK packet to the SDN controller with the frame described in Table \ref{tab:frame_table}, for each ADD\_DEVADDR\_WHITELIST and REMOVE\_DEVADDR\_WHITELIST received from Network Server.

\subsection{Fault tolerance}

One important aspect in LoRaWAN gateways is that if one of them goes down, the other running gateways keep transmitting all messages, so redundancy may mitigate the faulty gateway. Gateways inform their status to the Network Server by sending a heartbeat or keep-alive message, which is a common technique already implemented in popular LoRaWAN stacks like ChirpStack. In this NA proposal, if a Network Server detects that a gateway is down, it must deactivate all NA-gateways, transforming them to standard packet forwarders, so the packets assigned to the disconnected gateway have the chance to be forwarded by other gateways. In this situation, packet reception by Network Server is prioritized over backhaul traffic optimization, and the fault tolerance strategy becomes the same as the one in standard LoRaWAN.

If the gateway reactivates, the SDN controller activates back the NA mode to the corresponding gateways. \textcolor{red}{no entiendo esta ultima oracion}

\textcolor{blue}{If the faulty gateway is restored to operational status, the SDN controller activates back the NA mode to the corresponding gateways.}

\subsection{Gateway infrastructure updates}

If local infrastructure is modified, by adding/removing gateways or changing their location, the network administrator is able to carry out either a manual DevAddr update or an automatic one. On one hand, for manual updates, REMOVE\_DEVADDR\_WHITELIST and ADD\_DEVADDR\_WHITELIST packets can be sent through the SDN controller, so DevAddr are migrated from one gateway to another. On the other hand, for automatic updates, ForceRejoinReq can be sent to a group or all devices if necessary, so a new join process starts and best gateways are chosen. Which of both options is better will depend on each specific scenario.

\subsection{Filtering traffic by node id}

When a NA-LoRaWAN gateway receives an incoming packet, it should first check whether it is a join request packet or a data packet. For the first one, it should forward it immediately. For the second one, it should first check if the DevAddr is found on its whitelist. If it is so, the packet is forwarder; if not, it is discarded. This process is described in Figure \ref{fig:filter}.

\begin{figure}[htp]
    \centering
    \includegraphics[scale=0.35]{images_en/filter.png}
    \caption{Packet filtering at gateway level.}
    \label{fig:filter}
\end{figure}

\subsection{Filtering traffic by node priority}

Priority should be assigned by system administrators to each End Device, based on the use case requirements. A priority field, sent together with the DevAddr in the ADD\_DEVADDR\_WHITELIST packet payload, indicates the priority level of the device.

Moreover a SET\_PRIORITY packet should also be sent during network setup, which determines the minimum level of priority to filter. So if the payload of the SET\_PRIORITY packet contains the level 1, all packets coming from nodes with level 2 or above will be discarded.

When an incoming packet arrives to the gateway, it should check the End Device priority and decide upon that whether to forward or discard it. If the gateway does not contain priority information for that End Device, it either could forward it or discard it. This is a design decision that may vary according to the use case.

\subsection{Filtering traffic by consumers}

In this case, the gateway receives from the Network Server a number representing a period in minutes, which is transmitted in the payload of the SET\_PERIOD packet. The gateway is allowed to forward only one End Device packet in each period.

This period could be calculated by taken the minimum amount of minutes that an application needs to read a packet from End Devices. For example, if an application is reading temperature from sensors in the field, and it needs a sample every 1 hour, but the End Devices send every 30 minutes, half of the packets are not consumed by the application.

The gateway should locally filter an End Device packet, if it has already sent one during the same period. If there is no period information, it should forward all packets.

\subsection{Filtering traffic by budget}

A similar logic to the one described in the consumers policy is applied here. Each gateway receives a budget that limits the amount of bytes to be forwarded. It is a design decision whether this budget corresponds to the gateway or each End Device. Also, the period associated with this budget may also vary. For some applications the budget could be hourly, for others daily, etc.

A gateway receives a SET\_BUDGET packet from the Network Server, containing in its payload the maximum budget allowed to be forwarded. Every time a gateway receives a packet from an End Device, it should apply the logic described in subsection \ref{sec_filter_budget} and decide to forward or discard it.

\section{Simulation and Setup}\label{sec_sim}

In order to test the model presented and its potential benefits, the NA-LoRaWAN gateways and its traffic shaping policies introduced in this work were simulated. The tool used was based on the NS3 LoRaWAN module described in \cite{lorawansim1}, \cite{lorawansim2} and \cite{lorawansim3}. This module was modified and extended to add the extra layer of logic needed to run the gateways filters. The code has been published in a public repository \cite{ns3sim}.

Generic results that apply to all use cases are very difficult to predict, since there are many factors to take into account and they will depend on specific real case requirements and implementations --- from gateway and End Device locations, to qualitative data analysis (e.g. assigning priority in the traffic shaping policy). For running these simulations, 100 scenarios were created with different but arbitrary settings. The scenarios are divided in 5 groups of 20 depending on the amount of gateways: 1 gateway, 2 gateways, 4 gateways, 8 gateways and 16 gateways. All scenarios have a random number of End Devices from 10 to 2000, and are also randomly located. As stated earlier, this work is intended for small private LoRaWAN networks, so it was decided to work with less than 2000 End Devices and 16 gateways. End Devices were assigned priority levels from 1 to 5 in an uniform way (for traffic shaping policy "Filter by node priority"). The gateways were positioned following a grid pattern, as proposed by \cite{Booth2003}, which has been demonstrated to be an efficient algorithm to reduce the number of required antennas. The coverage of each gateway is around 9km and it is determined by the propagation model proposed in \cite{lorawansim1}, without taking into account building interference as it is not in the context of a city deployment. A sample scenario with 8 gateways can be seen in Figure \ref{fig:scen_1}.

\begin{figure}[htp]
    \centering
    \includegraphics[scale=0.6]{images_en/scenario_1.png}
    \caption{One sample of the generated scenarios, where the black circles represent the estimated area of coverage of each gateway, and the blue dots represent dispersed End Devices. The gray rectangle in the background delimits the area where the End Devices can be located.}
    \label{fig:scen_1}
\end{figure}

A duration of 1 hour for each simulation was chosen, and hence, initialization packets both of LoRaWAN specification (like join requests) and the ones introduced by this work (like the updates to the gateway whitelist), were not taken into account since they are only sent at the beginning, and under stable working conditions their impact is deprecated as time passes by (e.g. a 1 hour simulation will be more impacted by initialization packets than a 1 month one). Moreover, in order to simplify, it was determined that all packets were uplink, and sent every 20 minutes in unconfirmed mode. As a final remark, all packets have a size of 19 bytes and, since the NS3 LoRaWAN module, in which the tests were based, do not encrypt packets, they are significantly smaller than real ones.

In each simulation, 3 metrics were tracked:

\begin{itemize}
  \item \textit{Rx Ratio}: Total packets transmitted by gateways over total packets received by gateways.
  \item \textit{RxUnique Ratio}: Total unique packets transmitted by gateways over total unique packets received by gateways.
  \item \textit{RxDuplicated Ratio}: Total duplicated packets transmitted by gateways over total duplicated packets received by gateways.
\end{itemize}

It is assumed that there is no packet loss between the gateways and the Network Server, so the Rx in the metrics is from the point of view of the Network Server, and their values are exactly the same as if the transmission from the gateways were counted.

Duplicated and unique packets are considered across all gateways. So if two different gateways receive the same packet, one of them is counted as unique and the other one as duplicated. The reason why unique and duplicated packets were discriminated and measured, is to understand how many unique data each simulation is loosing as a tradeoff for reducing traffic in the backhaul.

\subsection{Varying number of gateways}

The first round of simulations consisted of simulating each of the 4 traffic shaping policies and the standard packet forwarder gateway (without any traffic shaping policy) on the total 100 scenarios generated. These resulted in a total of 500 simulations with more than 1500000 packets transmitted.

The settings were:

\begin{itemize}
  \item \textit{Budget}: 19 bytes by node every hour (if more bytes are needed to be transmitted, the packets will be discarded). This is equal to the size of 1 packet.
  \item \textit{Packets consumed by application}: 1 packet every hour (if extra packets arrived they will be discarded)
  \item \textit{Priority level}: Level 1 (level 2 to 5 are filtered by gateways)
\end{itemize}

Figure \ref{fig:sim_1} shows the summary with the results which are quite as expected. In the first 3 bars, with just packet forwarders (NA-LoRaWAN disabled), it can be seen that all packets were transmitted, both unique and duplicated. In the "Filter by node id" policy, only unique packets were transmitted, which in overall represents 87.32\% of the total of packets received by the gateways, and could be assumed as a saving of 12.68\% of bandwidth in the backhaul link. The "Filter by budget" and "Filter by consumers" policies are around 34.57\% in all 3 metrics, which is roughly filtering 2 out of 3 packets received by the gateways during the 1 hour simulation, corresponding to the settings described previously. Finally, the "Filter by node priority" policy shows that 19.88\% of packets were transmitted, which directly correlates with allowing only packets from priority level 1 to be forwarded, filtering levels 2 to 5, out of a uniform priority distribution.

\begin{figure}[htp]
    \centering
    \includegraphics[scale=0.5]{images_en/sim_1.png}
    \caption{Summary results of the first group of simulations.}
    \label{fig:sim_1}
\end{figure}

In the grid pattern used for locating gateways, there is a strict correlation between the number of gateways and the scenario size. For this case, in order to evaluate if the size of the scenario affected this results, the output was divided in 3 charts, one for each metric, grouped by the number of gateways in the X axis. The results can be seen in Figure \ref{fig:sim_2}. All policies remain with similar values as the ones shown previously, except for the "Filter by node id" policy in Figure \ref{fig:sim_2} (a), where the percentage of the packets transmitted decreases as scenario gets bigger: from 100\% when there is only 1 gateway, to 80.31\% when there are 16 gateways.

\begin{figure}[htp]
    \subfloat[]{
      \includegraphics[clip,width=\columnwidth]{images_en/sim_2.png}%
    }
    
    \subfloat[]{
      \includegraphics[clip,width=\columnwidth]{images_en/sim_3.png}%
    }
    
    \subfloat[]{
      \includegraphics[clip,width=\columnwidth]{images_en/sim_4.png}%
    }
    \caption{The results of the first group of simulations, discriminated by metrics and number of gateways. In all 3 charts, values of series "byBudget" and "byConsumers" are almost at the same value, reason why they cannot be easily differentiated. In (b) the series "none" and "byNodeId" are bot with value equal to 1.}
    \label{fig:sim_2}
\end{figure}

On the basis of the context of these simulations, it can be concluded that the "Filter by node id" policy improves bandwidth savings as more gateways are used. The other policies are consistent and scale with more gateways.

\subsection{Varying budget}

Another set of tests were ran which consisted in changing the budget allowed to be transmitted per node per gateway in one hour. For the first one, the same 19 bytes as before were used, then it was increased to 38 bytes, and finally it was increased to 57 bytes. As all packets have a size of 19 bytes, in the first budget only fits one packet, while in the second and third one, 2 and 3 packets respectively. For simplicity, these tests were ran only in the 20 scenarios generated with 4 gateways. Apart from the budget, the other settings were the same as the previous simulations.

The results, illustrated in the charts of Figure [] show that the only policy affected with the budget change is the "Filter by budget". As expected, in the first case almost 1/3 of the packets were transmitted (); in the second case almost 2/3 (); and finally, all of them in the last case. 

\subsection{Varying consumers packets}

Using an approach very similar to the previous tests, this time the packets to be consumed where changed. In the first tests, 1 packet per hour was used, in the second one 2 packets, and finally 3 packets. Again, only scenarios with 4 gateways were ran. The results in Figure [] show that only the "Filter by consumers" policy had different outputs in every run of the tests. In the first one 1/3 of the packets were transmitted (), while in the other two 2/3 () and all of them () respectively.

\subsection{Varying priorities}

Until now, although End Devices had 5 priorities (1 to 5) assign in an uniform way, only those who had priority level 1 were forwarded in the "Filter by node priority" policy. In these set of tests, the settings were almost the same as the previous ones, but on every execution the priority level was incremented, starting from 0 (does not forward any packet) until 5 (forwards every packet).

Figure [] shows, as expected, that only the policy involving priority threw different results in every test. First execution had 0\% of packets transmissions, second one had .., third had .., fourth had .., fith had ..., and in the last the 100\% of the packets were transmitted.

\textcolor{red}{para una revista necesitamos agregar más info en la simulacion. Curvas, intervalo de confianza, casos, etc. Tal vez evaluar las diferentes politicas de traffic shaping. Asi estamos para un congreso, podria ser CLEI que esta proximo a vencer o el que te pase ayer.
}
\section{Conclusions}\label{sec_conc}

In this work, a new LoRaWAN gateway was proposed with the aim to reduce traffic sent over the backhaul. Its impact becomes relevant in scenarios where the network is limited or expensive, like in IoRT. The main idea behind the gateway, called NA-LoRaWAN gateway, is that it can process traffic based on the End Device id. A general idea of how the gateway works was introduced, and some example applications were presented. A design and a simulation for one of them was described in detail, showing that it can potentially outperform standard LoRaWAN gateways.

Nevertheless, there is still more work to be done in future research in order to keep validating the gateway and applications proposed. Some ideas include: analyze potential pitfalls that this changes may introduce like having two networks running in the same area or security flaws introduced by the new commands, implement the design proposed and test it in the field, and explore other forms of identifying End Devices in the gateway so it can be adapted to other scenarios where nodes move freely.


\bibliography{bibliography}
\bibliographystyle{IEEEtran}

\end{document}

