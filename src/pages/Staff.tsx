import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  User,
  UserCog,
  UserPlus,
  Users,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { addStaffMember, deleteStaffMember, getStaffMembers, updateStaffMember } from '@/lib/data';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { User as UserType, UserRole } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

export default function Staff() {
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [staff, setStaff] = useState(getStaffMembers());
  const [selectedStaff, setSelectedStaff] = useState<UserType | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStaffFormOpen, setIsStaffFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form states
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffRole, setStaffRole] = useState<UserRole>('staff');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Initialize staff list from localStorage on component mount
  useEffect(() => {
    const staffListString = localStorage.getItem('staffList');
    if (staffListString) {
      try {
        const parsedStaffList = JSON.parse(staffListString);
        setStaff(parsedStaffList);
      } catch (error) {
        console.error('Failed to parse staff list from localStorage', error);
        // Fallback to default staff list
        const defaultStaff = getStaffMembers();
        setStaff(defaultStaff);
        localStorage.setItem('staffList', JSON.stringify(defaultStaff));
      }
    } else {
      // If no staff list in localStorage, initialize with default and save to localStorage
      const defaultStaff = getStaffMembers();
      setStaff(defaultStaff);
      localStorage.setItem('staffList', JSON.stringify(defaultStaff));
    }
  }, []);
  
  const resetForm = () => {
    setStaffName('');
    setStaffEmail('');
    setStaffRole('staff');
    setStaffPhone('');
    setStaffPassword('');
    setShowPassword(false);
    setIsEditing(false);
    setSelectedStaff(null);
  };

  const handleOpenStaffForm = (staff?: UserType) => {
    if (staff) {
      setSelectedStaff(staff);
      setStaffName(staff.name);
      setStaffEmail(staff.email);
      setStaffRole(staff.role);
      setStaffPhone(staff.phone || '');
      setStaffPassword(''); // Reset password field when editing
      setIsEditing(true);
    } else {
      resetForm();
    }
    setIsStaffFormOpen(true);
  };

  const handleDeleteStaff = async (staffId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      deleteStaffMember(staffId);
      
      // Update local state
      const updatedStaffList = staff.filter(s => s.id !== staffId);
      setStaff(updatedStaffList);
      
      // Update localStorage
      localStorage.setItem('staffList', JSON.stringify(updatedStaffList));
      
      setIsDeleteDialogOpen(false);
      toast.success('Staff member deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete staff member');
    }
  };

  const handleSubmitStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (isEditing && selectedStaff) {
        // Update existing staff
        const updates: Partial<UserType> = {
          name: staffName,
          email: staffEmail,
          role: staffRole,
          phone: staffPhone || undefined,
        };
        
        // Only update password if one was provided
        if (staffPassword) {
          updates.password = staffPassword;
        }
        
        const updatedStaff = updateStaffMember(selectedStaff.id, updates);
        if (updatedStaff) {
          // Update local state
          const updatedStaffList = staff.map(s => s.id === selectedStaff.id ? updatedStaff : s);
          setStaff(updatedStaffList);
          
          // Update localStorage
          localStorage.setItem('staffList', JSON.stringify(updatedStaffList));
          
          toast.success('Staff member updated successfully');
        }
      } else {
        // Add new staff with required password
        if (!staffPassword) {
          toast.error('Password is required for new staff members');
          return;
        }
        
        const newStaff = addStaffMember({
          name: staffName,
          email: staffEmail,
          role: staffRole,
          phone: staffPhone || undefined,
          password: staffPassword,
        });
        
        // Update local state
        const updatedStaffList = [newStaff, ...staff];
        setStaff(updatedStaffList);
        
        // Update localStorage
        localStorage.setItem('staffList', JSON.stringify(updatedStaffList));
        
        toast.success('Staff member added successfully');
      }
      
      setIsStaffFormOpen(false);
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save staff member');
    }
  };

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight animate-fade-in">Staff Management</h1>
          <p className="text-muted-foreground animate-slide-in-bottom">
            Manage your staff members and their access permissions
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search staff..."
              className="pl-8 md:w-[300px] lg:w-[400px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button onClick={() => handleOpenStaffForm()}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Staff Member
          </Button>
        </div>

        <Card className="border shadow-sm">
          <CardHeader className="p-5">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>Staff Members</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredStaff.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <User className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <p className="text-lg font-medium text-center">No staff members found</p>
                <p className="text-muted-foreground text-center mt-1">
                  {searchTerm ? "Try adjusting your search." : "Add your first staff member to get started."}
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => handleOpenStaffForm()}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Staff Member
                </Button>
              </div>
            ) : (
              <div className="rounded-md border-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.map((staffMember) => (
                      <TableRow key={staffMember.id} className="transition-all hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${staffMember.name}`} alt={staffMember.name} />
                              <AvatarFallback>{staffMember.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{staffMember.name}</div>
                              {staffMember.phone && (
                                <div className="text-xs text-muted-foreground">{staffMember.phone}</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{staffMember.email}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={staffMember.role === 'admin' 
                              ? 'bg-primary/10 text-primary border-primary/20' 
                              : 'bg-muted'}
                          >
                            {staffMember.role === 'admin' ? 'Admin' : 'Staff'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(staffMember.createdAt), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[160px]">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleOpenStaffForm(staffMember)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => {
                                  setSelectedStaff(staffMember);
                                  setIsDeleteDialogOpen(true);
                                }}
                                disabled={staffMember.id === currentUser?.id}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Staff Form Dialog */}
      <Dialog open={isStaffFormOpen} onOpenChange={(open) => {
        setIsStaffFormOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <UserCog className="h-5 w-5" />
                  <span>Edit Staff Member</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" />
                  <span>Add New Staff Member</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Make changes to the staff member details below.' 
                : 'Fill in the details to add a new staff member.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitStaff} className="space-y-6 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">
                  {isEditing ? "Password (leave blank to keep current)" : "Password"}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={isEditing ? "••••••••" : "Enter password"}
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    required={!isEditing}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {isEditing 
                    ? "Only fill this if you want to change the password." 
                    : "This password will be used for login."}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 123-4567"
                  value={staffPhone}
                  onChange={(e) => setStaffPhone(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={staffRole}
                  onValueChange={(value) => setStaffRole(value as UserRole)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {staffRole === 'admin' 
                    ? 'Admins have full access to all features.' 
                    : 'Staff members have limited access to features.'}
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">
                {isEditing ? 'Update Staff Member' : 'Add Staff Member'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the staff member "{selectedStaff?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedStaff && handleDeleteStaff(selectedStaff.id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
