import React, { useState } from 'react';
import { useAcademy } from '../../context/AcademyContext';
import { Staff, HardwareAsset, Room } from '../../types';
import {
  Users,
  Cpu,
  MapPin,
  PlusCircle,
  Phone,
  Mail,
  Shield,
  Monitor,
  CheckCircle2,
  AlertTriangle,
  X,
  Edit2,
  Trash2,
  Layers
} from 'lucide-react';

export const InventoryStaffView: React.FC = () => {
  const {
    staffList,
    assets,
    rooms,
    addStaff,
    updateStaff,
    deleteStaff,
    addAsset,
    updateAsset,
    deleteAsset,
    addRoom,
    updateRoom,
    deleteRoom
  } = useAcademy();

  const [activeTab, setActiveTab] = useState<'staff' | 'hardware' | 'rooms'>('staff');

  // Add Staff Modal State
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [staffUsername, setStaffUsername] = useState('');
  const [staffPassword, setStaffPassword] = useState('123456');
  const [role, setRole] = useState<'ADMIN' | 'MANAGER' | 'COUNSELOR' | 'ACCOUNTS' | 'TRAINER'>('TRAINER');
  const [designation, setDesignation] = useState('Senior Faculty');
  const [salary, setSalary] = useState(30000);

  // Edit Staff Modal State
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [editStaffName, setEditStaffName] = useState('');
  const [editStaffEmail, setEditStaffEmail] = useState('');
  const [editStaffPhone, setEditStaffPhone] = useState('');
  const [editStaffUsername, setEditStaffUsername] = useState('');
  const [editStaffPassword, setEditStaffPassword] = useState('');
  const [editStaffRole, setEditStaffRole] = useState<any>('TRAINER');
  const [editStaffDesignation, setEditStaffDesignation] = useState('');
  const [editStaffSalary, setEditStaffSalary] = useState(30000);
  const [editStaffStatus, setEditStaffStatus] = useState<string>('Active');
  const [deletingStaff, setDeletingStaff] = useState<Staff | null>(null);

  // Add Asset Modal State
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [assetName, setAssetName] = useState('');
  const [assetCategory, setAssetCategory] = useState<any>('Computer');
  const [assetTag, setAssetTag] = useState(`NCA-PC-${Math.floor(100 + Math.random() * 900)}`);
  const [assetRoom, setAssetRoom] = useState(rooms[0]?.name || 'Lab-1');
  const [assetSpecs, setAssetSpecs] = useState('Core i7 13th Gen, 32GB RAM, RTX 4060, NVMe 1TB');

  // Edit Asset Modal State
  const [editingAsset, setEditingAsset] = useState<HardwareAsset | null>(null);
  const [editAssetName, setEditAssetName] = useState('');
  const [editAssetCategory, setEditAssetCategory] = useState<any>('Computer');
  const [editAssetTag, setEditAssetTag] = useState('');
  const [editAssetRoom, setEditAssetRoom] = useState('');
  const [editAssetSpecs, setEditAssetSpecs] = useState('');
  const [editAssetCondition, setEditAssetCondition] = useState<any>('Good');
  const [deletingAsset, setDeletingAsset] = useState<HardwareAsset | null>(null);

  // Room State
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState<'Lab' | 'Theory Classroom' | 'Seminar Hall' | 'Studio'>('Lab');
  const [roomCapacity, setRoomCapacity] = useState(25);
  const [roomFacilities, setRoomFacilities] = useState('Projector, AC, High-Speed Wi-Fi, 24 PCs');
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deletingRoom, setDeletingRoom] = useState<Room | null>(null);

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const generatedUsername = staffUsername.trim().toLowerCase() || name.trim().toLowerCase().split(' ')[0] + Math.floor(10 + Math.random() * 90);

    addStaff({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      username: generatedUsername,
      password: staffPassword.trim() || '123456',
      role,
      designation: designation.trim(),
      salary,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    });

    setIsStaffModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    setStaffUsername('');
    setStaffPassword('123456');
  };

  const openEditStaff = (staff: Staff) => {
    setEditingStaff(staff);
    setEditStaffName(staff.name);
    setEditStaffEmail(staff.email);
    setEditStaffPhone(staff.phone);
    setEditStaffUsername(staff.username || '');
    setEditStaffPassword(staff.password || '');
    setEditStaffRole(staff.role);
    setEditStaffDesignation(staff.designation);
    setEditStaffSalary(staff.salary || 30000);
    setEditStaffStatus(staff.status || 'Active');
  };

  const handleSaveStaffEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff || !editStaffName.trim()) return;

    updateStaff(editingStaff.id, {
      name: editStaffName.trim(),
      email: editStaffEmail.trim(),
      phone: editStaffPhone.trim(),
      username: editStaffUsername.trim().toLowerCase() || editingStaff.username,
      password: editStaffPassword.trim() || editingStaff.password || '123456',
      role: editStaffRole,
      designation: editStaffDesignation.trim(),
      salary: editStaffSalary,
      status: editStaffStatus
    });

    setEditingStaff(null);
  };

  const handleAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName.trim()) return;

    addAsset({
      name: assetName.trim(),
      category: assetCategory,
      assetTag: assetTag.trim(),
      room: assetRoom.trim(),
      specs: assetSpecs.trim(),
      condition: 'Good',
      purchaseDate: new Date().toISOString().split('T')[0]
    });

    setIsAssetModalOpen(false);
    setAssetName('');
  };

  const openEditAsset = (asset: HardwareAsset) => {
    setEditingAsset(asset);
    setEditAssetName(asset.name);
    setEditAssetCategory(asset.category);
    setEditAssetTag(asset.assetTag);
    setEditAssetRoom(asset.room);
    setEditAssetSpecs(asset.specs);
    setEditAssetCondition(asset.condition);
  };

  const handleSaveAssetEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset || !editAssetName.trim()) return;

    updateAsset(editingAsset.id, {
      name: editAssetName.trim(),
      category: editAssetCategory,
      assetTag: editAssetTag.trim(),
      room: editAssetRoom.trim(),
      specs: editAssetSpecs.trim(),
      condition: editAssetCondition
    });

    setEditingAsset(null);
  };

  const handleRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;

    const facilitiesArray = roomFacilities
      .split(',')
      .map(f => f.trim())
      .filter(Boolean);

    if (editingRoom) {
      updateRoom(editingRoom.id, {
        name: roomName.trim(),
        type: roomType,
        capacity: roomCapacity,
        facilities: facilitiesArray
      });
      setEditingRoom(null);
    } else {
      addRoom({
        name: roomName.trim(),
        type: roomType,
        capacity: roomCapacity,
        facilities: facilitiesArray
      });
      setIsRoomModalOpen(false);
    }

    setRoomName('');
  };

  const openEditRoom = (rm: Room) => {
    setEditingRoom(rm);
    setRoomName(rm.name);
    setRoomType(rm.type as any);
    setRoomCapacity(rm.capacity);
    setRoomFacilities(rm.facilities.join(', '));
    setIsRoomModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Staff Directory & Lab Hardware Inventory
            </h2>
            <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
              Academy Infrastructure
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Manage instructors, administrative employees, lab computer assets, and classroom setups
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {activeTab === 'staff' && (
            <button
              onClick={() => setIsStaffModalOpen(true)}
              className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Staff Member</span>
            </button>
          )}

          {activeTab === 'hardware' && (
            <button
              onClick={() => {
                setAssetTag(`NCA-PC-${Math.floor(100 + Math.random() * 900)}`);
                setIsAssetModalOpen(true);
              }}
              className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Hardware Asset</span>
            </button>
          )}

          {activeTab === 'rooms' && (
            <button
              onClick={() => {
                setEditingRoom(null);
                setRoomName('');
                setRoomFacilities('Projector, AC, High-Speed Wi-Fi');
                setIsRoomModalOpen(true);
              }}
              className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Lab / Room</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-bold space-x-6">
        <button
          onClick={() => setActiveTab('staff')}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === 'staff'
              ? 'border-indigo-600 text-indigo-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Staff & Faculty Roster ({staffList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('hardware')}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === 'hardware'
              ? 'border-indigo-600 text-indigo-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Lab Assets & PCs ({assets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rooms')}
          className={`pb-3 border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === 'rooms'
              ? 'border-indigo-600 text-indigo-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Classrooms & Labs ({rooms.length})</span>
        </button>
      </div>

      {/* TAB 1: STAFF LIST */}
      {activeTab === 'staff' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staffList.map(staff => (
            <div
              key={staff.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-indigo-300 transition-all space-y-3 relative group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{staff.name}</h3>
                  <span className="text-[11px] text-slate-500">{staff.designation}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                    {staff.role}
                  </span>
                  <button
                    onClick={() => openEditStaff(staff)}
                    title="Edit Staff"
                    className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingStaff(staff)}
                    title="Delete Staff"
                    className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl text-xs space-y-1 text-slate-600">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono text-indigo-700 font-bold">@{staff.username || 'staff'}</span>
                  <span className="text-[10px] text-slate-400 font-mono">pwd: {staff.password ? '••••••' : 'Default'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{staff.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{staff.email}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                <span className="text-slate-500">Salary: <strong className="text-slate-900">৳{staff.salary?.toLocaleString()}</strong></span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {staff.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: HARDWARE ASSETS */}
      {activeTab === 'hardware' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Asset Tag & Device</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Hardware Specifications</th>
                  <th className="py-3 px-4">Assigned Location</th>
                  <th className="py-3 px-4">Condition</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assets.map(asset => (
                  <tr key={asset.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{asset.name}</div>
                      <div className="font-mono text-[10px] text-indigo-600">{asset.assetTag}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{asset.category}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-sm">{asset.specs}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{asset.room}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        asset.condition === 'Good' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {asset.condition}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => openEditAsset(asset)}
                        title="Edit Asset"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingAsset(asset)}
                        title="Delete Asset"
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ROOMS */}
      {activeTab === 'rooms' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {rooms.map(room => (
            <div key={room.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3 relative group">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">{room.name}</h3>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                    {room.type}
                  </span>
                  <button
                    onClick={() => openEditRoom(room)}
                    title="Edit Room"
                    className="p-1 text-slate-400 hover:text-indigo-600 rounded-md transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingRoom(room)}
                    title="Delete Room"
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <div>Max Capacity: <strong className="text-slate-900">{room.capacity} Students</strong></div>
                <div className="text-slate-500">{room.facilities.join(' • ')}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Staff Modal */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 bg-indigo-950 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">Register Staff / Instructor</h3>
              <button onClick={() => setIsStaffModalOpen(false)} className="p-1 rounded-lg text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStaffSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prodip Chowdhury"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Role / Department</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold outline-none"
                  >
                    <option value="TRAINER">Trainer / Faculty</option>
                    <option value="COUNSELOR">Counselor</option>
                    <option value="ACCOUNTS">Accounts Staff</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">System Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Designation Title</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={e => setDesignation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Monthly Basic Salary (৳)</label>
                  <input
                    type="number"
                    value={salary}
                    onChange={e => setSalary(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Login Username</label>
                  <input
                    type="text"
                    placeholder="e.g. prodip"
                    value={staffUsername}
                    onChange={e => setStaffUsername(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Login Password</label>
                <input
                  type="text"
                  placeholder="Default: 123456"
                  value={staffPassword}
                  onChange={e => setStaffPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Save Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 bg-indigo-950 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">Edit Staff Profile</h3>
              <button onClick={() => setEditingStaff(null)} className="p-1 rounded-lg text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaffEdit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editStaffName}
                  onChange={e => setEditStaffName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Role</label>
                  <select
                    value={editStaffRole}
                    onChange={e => setEditStaffRole(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold outline-none"
                  >
                    <option value="TRAINER">Trainer / Faculty</option>
                    <option value="COUNSELOR">Counselor</option>
                    <option value="ACCOUNTS">Accounts Staff</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">System Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Designation</label>
                  <input
                    type="text"
                    value={editStaffDesignation}
                    onChange={e => setEditStaffDesignation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editStaffPhone}
                    onChange={e => setEditStaffPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    value={editStaffEmail}
                    onChange={e => setEditStaffEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Monthly Salary (৳)</label>
                  <input
                    type="number"
                    value={editStaffSalary}
                    onChange={e => setEditStaffSalary(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Status</label>
                  <select
                    value={editStaffStatus}
                    onChange={e => setEditStaffStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Resigned">Resigned</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Login Username</label>
                  <input
                    type="text"
                    value={editStaffUsername}
                    onChange={e => setEditStaffUsername(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Reset Password</label>
                  <input
                    type="text"
                    placeholder="Leave blank to keep unchanged"
                    value={editStaffPassword}
                    onChange={e => setEditStaffPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Staff Confirmation */}
      {deletingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-5 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Remove Staff Member</h3>
                <p className="text-[11px] text-slate-500">{deletingStaff.designation}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to remove <strong>{deletingStaff.name}</strong> from the active roster? It will be archived in the system Trash.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingStaff(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteStaff(deletingStaff.id);
                  setDeletingStaff(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs"
              >
                Delete Staff
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Asset Modal */}
      {isAssetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 bg-indigo-950 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">Add Lab Hardware Asset</h3>
              <button onClick={() => setIsAssetModalOpen(false)} className="p-1 rounded-lg text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssetSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Device / Asset Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Workstation PC #19"
                  value={assetName}
                  onChange={e => setAssetName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Asset Tag</label>
                  <input
                    type="text"
                    value={assetTag}
                    onChange={e => setAssetTag(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Assigned Room</label>
                  <select
                    value={assetRoom}
                    onChange={e => setAssetRoom(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none"
                  >
                    {rooms.map(rm => (
                      <option key={rm.id} value={rm.name}>{rm.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Hardware Specifications</label>
                <textarea
                  rows={2}
                  value={assetSpecs}
                  onChange={e => setAssetSpecs(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAssetModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Asset Modal */}
      {editingAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 bg-indigo-950 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">Edit Asset: {editingAsset.name}</h3>
              <button onClick={() => setEditingAsset(null)} className="p-1 rounded-lg text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAssetEdit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Device Name *</label>
                <input
                  type="text"
                  required
                  value={editAssetName}
                  onChange={e => setEditAssetName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Asset Tag</label>
                  <input
                    type="text"
                    value={editAssetTag}
                    onChange={e => setEditAssetTag(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Room</label>
                  <select
                    value={editAssetRoom}
                    onChange={e => setEditAssetRoom(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none"
                  >
                    {rooms.map(rm => (
                      <option key={rm.id} value={rm.name}>{rm.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Category</label>
                  <select
                    value={editAssetCategory}
                    onChange={e => setEditAssetCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none"
                  >
                    <option value="Computer">Computer</option>
                    <option value="Display">Display</option>
                    <option value="Network">Network</option>
                    <option value="Audio">Audio</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Condition</label>
                  <select
                    value={editAssetCondition}
                    onChange={e => setEditAssetCondition(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none font-bold"
                  >
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Maintenance Required">Needs Maintenance</option>
                    <option value="Out of Order">Out of Order</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Hardware Specifications</label>
                <textarea
                  rows={2}
                  value={editAssetSpecs}
                  onChange={e => setEditAssetSpecs(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAsset(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Asset Confirmation */}
      {deletingAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-5 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Delete Hardware Asset</h3>
                <p className="text-[11px] text-slate-500 font-mono">{deletingAsset.assetTag}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete asset <strong>{deletingAsset.name}</strong>?
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingAsset(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteAsset(deletingAsset.id);
                  setDeletingAsset(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs"
              >
                Delete Asset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Room Modal */}
      {isRoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 bg-indigo-950 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold">{editingRoom ? 'Edit Room / Lab' : 'Create Room / Lab'}</h3>
              <button
                onClick={() => {
                  setIsRoomModalOpen(false);
                  setEditingRoom(null);
                }}
                className="p-1 rounded-lg text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRoomSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Room / Lab Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lab-3 (Graphics & 3D Lab)"
                  value={roomName}
                  onChange={e => setRoomName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Room Type</label>
                  <select
                    value={roomType}
                    onChange={e => setRoomType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold outline-none"
                  >
                    <option value="Lab">Computer Lab</option>
                    <option value="Theory Classroom">Theory Classroom</option>
                    <option value="Seminar Hall">Seminar Hall</option>
                    <option value="Studio">Studio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Student Capacity</label>
                  <input
                    type="number"
                    value={roomCapacity}
                    onChange={e => setRoomCapacity(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Facilities / Equipment (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. 24 PCs, Projector, High-Speed Internet, AC"
                  value={roomFacilities}
                  onChange={e => setRoomFacilities(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsRoomModalOpen(false);
                    setEditingRoom(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  {editingRoom ? 'Save Room' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Room Confirmation */}
      {deletingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-5 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Delete Room</h3>
                <p className="text-[11px] text-slate-500">{deletingRoom.name}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to remove <strong>{deletingRoom.name}</strong>?
            </p>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingRoom(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteRoom(deletingRoom.id);
                  setDeletingRoom(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs"
              >
                Delete Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
