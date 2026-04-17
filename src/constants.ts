import { Layout, Shield, Lock, Zap, Terminal, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';

export interface SimulationStep {
  message: string;
  type: 'info' | 'success' | 'warn' | 'error' | 'critical';
  timestamp: string;
}

export interface MalwareType {
  id: string;
  name: string;
  fullName: string;
  icon: any;
  description: string;
  mechanism: string;
  payloadTitle: string;
  payloadCode: string;
  prevention: string[];
  threatLevel: 'High' | 'Critical' | 'Moderate';
  simulationSteps: SimulationStep[];
}

export const MALWARE_DATA: MalwareType[] = [
  {
    id: 'rat',
    name: 'RAT',
    fullName: 'Remote Access Trojan',
    icon: Activity,
    threatLevel: 'Critical',
    description: `A Remote Access Trojan (RAT) is a type of malware that provides a back door for administrative control over the target computer.`,
    mechanism: `RATs are usually downloaded invisibly with a user-requested program or as an attachment in an email. Once the system is compromised, the attacker may use it to distribute RATs to other vulnerable computers and establish a botnet.`,
    simulationSteps: [
      { message: "Scanning for open ports...", type: "info", timestamp: "00:01" },
      { message: "Vulnerability found in RDP service (CVE-2019-0708)", type: "warn", timestamp: "00:04" },
      { message: "Executing exploit payload...", type: "info", timestamp: "00:08" },
      { message: "Persistence established: HKCU Run Key modified", type: "success", timestamp: "00:12" },
      { message: "Contacting Command & Control (C2) server: 104.28.x.x", type: "info", timestamp: "00:15" },
      { message: "Exfiltrating credentials.db", type: "warn", timestamp: "00:22" },
      { message: "Active remote shell established. Awaiting input.", type: "critical", timestamp: "00:30" },
    ],
    payloadTitle: 'Simulated RAT Beaconing Sequence',
    payloadCode: `# RAT EXECUTION LOG (SIMULATED)
# -------------------------------
[INFO] Initializing persistence...
[INFO] Writing to HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run
[INFO] Establishing encrypted tunnel to C2 server: 104.28.x.x:443
[INFO] Beacon heartbeat started (interval: 30s)
[INFO] Host Information Gathered:
       - OS: Windows 11 Pro
       - User: admin_workstation
       - IP: 192.168.1.15
[SUCCESS] Shell access obtained. Awaiting remote commands...`,
    prevention: [
      'Use a firewall to block unauthorized inbound/outbound traffic',
      'Keep software and OS updated to patch vulnerabilities',
      'Avoid downloading files from untrusted sources',
      "Monitor for unusual network activity ('beaconing')"
    ]
  },
  {
    id: 'ransomware',
    name: 'Ransomware',
    fullName: 'Extortion Malware',
    icon: Lock,
    threatLevel: 'Critical',
    description: `Ransomware is a type of malware from cryptovirology that threatens to publish the victim's data or perpetually block access to it unless a ransom is paid.`,
    mechanism: `Advanced ransomware uses cryptoviral extortion, where it encrypts the victim's files, making them inaccessible, and demands a ransom payment to decrypt them.`,
    simulationSteps: [
      { message: "Downloading encryption module...", type: "info", timestamp: "00:02" },
      { message: "Generating AES-256 Symmetric Key...", type: "info", timestamp: "00:05" },
      { message: "Disabling Windows Defender...", type: "warn", timestamp: "00:10" },
      { message: "Scanning C:/Users/Documents for target files...", type: "info", timestamp: "00:14" },
      { message: "ENCRYPTING: project_blue_final.pdf", type: "warn", timestamp: "00:18" },
      { message: "ENCRYPTING: financial_q3_report.xlsx", type: "warn", timestamp: "00:20" },
      { message: "Deleting Volume Shadow Copies (No Recovery Possible)", type: "critical", timestamp: "00:25" },
      { message: "Displaying Ransom Note. System Locked.", type: "critical", timestamp: "00:30" },
    ],
    payloadTitle: 'Simulated Encryption Logic',
    payloadCode: `# RANSOMWARE LOGIC (SIMULATED)
# -------------------------------
[INIT] Loading RSA-2048 Master Public Key...
[TRANS] Walking directory: C:\\Users\\Victim\\Documents
[ENCRYPT] SymKey Gen: [AES-256-CBC]
[FILE] encrypting: report.docx -> report.docx.cryptify
[FILE] encrypting: finance.xlsx -> finance.xlsx.cryptify
[CLEAN] Wiping Volume Shadow Copies (vssadmin delete shadows /all)
[NOTICE] Dropping DECRYPT_INSTRUCTIONS.txt
[DONE] System locked. Displaying splash screen...`,
    prevention: [
      'Maintain regular offline backups of critical data',
      'Enable multi-factor authentication (MFA) on all accounts',
      'Use advanced endpoint detection and response (EDR)',
      'Educate users on phishing awareness'
    ]
  },
  {
    id: 'virus',
    name: 'Virus',
    fullName: 'Self-Replicating Malware',
    icon: Zap,
    threatLevel: 'High',
    description: `A computer virus is a type of computer program that, when executed, replicates itself by modifying other computer programs and inserting its own code.`,
    mechanism: `Viruses attach themselves to legitimate programs or documents. When someone opens the infected file, the virus executes its code and spreads to other files on the system or network.`,
    simulationSteps: [
      { message: "Executed via infected attachment: invoice.exe", type: "info", timestamp: "00:01" },
      { message: "Infecting system process: explorer.exe", type: "warn", timestamp: "00:06" },
      { message: "Searching for .exe files to infect...", type: "info", timestamp: "00:12" },
      { message: "MODIFIED: chrome.exe (6.4kb code injected)", type: "warn", timestamp: "00:15" },
      { message: "Broadcasting to LAN for lateral movement...", type: "warn", timestamp: "00:20" },
      { message: "Payload: Deleting MBR (Master Boot Record)", type: "critical", timestamp: "00:25" },
      { message: "SYSTEM CRITICAL FAILURE: BOOT SECTOR CORRUPTED", type: "critical", timestamp: "00:30" },
    ],
    payloadTitle: 'Simulated Replication Cycle',
    payloadCode: `# VIRUS PROPAGATION TRACE (SIMULATED)
# -------------------------------
[START] Resident module loaded in memory...
[SCAN] Searching for target executables (.exe, .dll)
[INFECT] Target: explorer.exe
         - Hijacking Entry Point: 0x0045A1D2
         - Injecting 4KB malicious segment
         - Redirecting call sequence to payload_main()
[SCAN] Searching mapped network drives (Z:, Y:)
[COPY] Replicating to network_shared_folder/Installer.exe
[DONE] Stealth mode active. Memory usage masked.`,
    prevention: [
      'Install and use reputable antivirus/antimalware software',
      'Disable macros in Microsoft Office by default',
      'Scan all incoming downloads and email attachments',
      "Avoid using cracked software or 'warez'"
    ]
  }
];

