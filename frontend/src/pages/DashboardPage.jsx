// frontend/src/pages/DashboardPage.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getProfiles } from '../services/profileService';

// --- SVG Icons (Assume these are correct and unchanged) ---
const DiscoverIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10C17 13.866 13.866 17 10 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M15 15.0005L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ShortlistIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M5 3V21L12 17L19 21V3H5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const HiredIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path fillRule="evenodd" clipRule="evenodd" d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M23 21V19C22.9995 16.9567 21.4136 15.2499 19.3733 15.0507" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path fillRule="evenodd" clipRule="evenodd" d="M17 11C18.0745 11 19.0989 10.6907 19.9172 10.1343C20.3057 9.87193 20.6446 9.56088 20.9262 9.21125" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const HelpIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 8.00024H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const SettingsIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.2218 21V19.2787C13.0367 19.1043 13.8028 18.7837 14.4916 18.3359L15.8359 19.6803L17.6803 17.8359L16.3359 16.4916C16.7837 15.8028 17.1043 15.0367 17.2787 14.2218H19.2218V11.7787H17.2787C17.1043 10.9633 16.7837 10.1972 16.3359 9.50844L17.6803 8.16409L15.8359 6.31972L14.4916 7.66409C13.8028 7.21627 13.0367 6.89569 12.2218 6.72133V4.77868H9.77817V6.72133C8.96329 6.89569 8.19723 7.21627 7.50844 7.66409L6.16409 6.31972L4.31972 8.16409L5.66409 9.50844C5.21627 10.1972 4.89569 10.9633 4.72133 11.7787H2.77817V14.2218H4.72133C4.89569 15.0367 5.21627 15.8028 5.66409 16.4916L4.31972 17.8359L6.16409 19.6803L7.50844 18.3359C8.19723 18.7837 8.96329 19.1043 9.77817 19.2787V21H12.2218Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path fillRule="evenodd" clipRule="evenodd" d="M11 13C11 11.8954 11.8954 11 13 11C14.1046 11 15 11.8954 15 13C15 14.1046 14.1046 15 13 15C11.8954 15 11 14.1046 11 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const DropdownArrowIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>;
const EndorsementIconSVG = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-500 mr-1"><path d="M20 19.4286V7.28571C20 5.25283 19.0924 3.33788 17.5355 2C15.9787 0.662121 13.9076 0 12 0C10.0924 0 8.02132 0.662121 6.46447 2C4.90762 3.33788 4 5.25283 4 7.28571V19.4286L8 17.7143L12 19.4286L16 17.7143L20 19.4286Z" fill="currentColor"/><path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" fill="white"/></svg>;
const StarIconFilled = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="#FFC107" xmlns="http://www.w3.org/2000/svg" className="text-yellow-400"><path fillRule="evenodd" clipRule="evenodd" d="M5 3V21L12 17L19 21V3H5Z" stroke="#FFC107" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const StarIconOutline = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M5 3V21L12 17L19 21V3H5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const BellIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M18.4125 11.9L20.2631 15.5475C20.5129 16.0401 20.3162 16.6419 19.8237 16.8918C19.6835 16.9629 19.5285 17 19.3713 17H4.62866C4.07638 17 3.62866 16.5523 3.62866 16C3.62866 15.8428 3.66574 15.6878 3.73687 15.5475L5.58747 11.9V8.47347C5.58747 5.78625 7.79997 3 12 3C16.2 3 18.4125 5.68433 18.4125 8.47347V11.9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path fillRule="evenodd" clipRule="evenodd" d="M8 17H16V17.6091C16 18.6134 15.4975 19.5511 14.6612 20.1072C13.7662 20.7024 12.878 21 11.9966 21C11.1159 21 10.2293 20.7028 9.33702 20.1085C8.50178 19.5522 8 18.6152 8 17.6116V17Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const PlusIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const LocationFilterIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle text-gray-500"><path fillRule="evenodd" clipRule="evenodd" d="M11.9455 3.00158C11.9639 3.00158 11.9819 3.00079 11.9999 3C12.0179 3.00079 12.0358 3.00158 12.0543 3.00158C16.4358 3.06442 20 6.36 20 10.3362C20 15.6 14.2751 19.2338 11.9999 21C11.8479 20.8819 4 15.6 4 10.3362C4 6.36 7.5644 3.06458 11.9455 3.00158Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path fillRule="evenodd" clipRule="evenodd" d="M12 13C13.3807 13 14.5 11.8807 14.5 10.5C14.5 9.11929 13.3807 8 12 8C10.6193 8 9.5 9.11929 9.5 10.5C9.5 11.8807 10.6193 13 12 13Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const GeneralFilterIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-600"><path fillRule="evenodd" clipRule="evenodd" d="M7 7C5.89543 7 5 6.10457 5 5C5 3.89543 5.89543 3 7 3C8.10457 3 9 3.89543 9 5C9 6.10457 8.10457 7 7 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path fillRule="evenodd" clipRule="evenodd" d="M7 21C5.89543 21 5 20.1046 5 19C5 17.8954 5.89543 17 7 17C8.10457 17 9 17.8954 9 19C9 20.1046 8.10457 21 7 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path fillRule="evenodd" clipRule="evenodd" d="M17 14C15.8954 14 15 13.1046 15 12C15 10.8954 15.8954 10 17 10C18.1046 10 19 10.8954 19 12C19 13.1046 18.1046 14 17 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 5H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M9.99683 5H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 19H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M9.99683 19H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M14.0032 12H3.00003" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const BurgerIconFull = () => ( <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg> );
const CloseIconFull = () => ( <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg> );
// --- End SVG Icons ---

const manualSkillOptions = ["React", "Node.js", "JavaScript", "Python", "MongoDB", "Google Ads", "Marketing Strategy", "Vue", "Angular", "SEO", "Content Writing", "UI/UX Design"];
const manualLocationOptions = ["Bangalore", "Chennai", "Coimbatore", "Remote", "Hyderabad", "Pune", "Mumbai", "Delhi", "Noida"];

// FilterControls component defined OUTSIDE DashboardPage
const FilterControls = ({
    roleFilter, onRoleChange,
    skillsFilter, onSkillsChange,
    locationFilter, onLocationChange
}) => (
    <>
        <input 
            type="text" 
            placeholder="Enter Role (e.g., Developer)" 
            className="p-2.5 h-10 border border-gray-300 rounded-md flex-1 text-sm focus:ring-1 focus:ring-brand-focus-ring focus:border-brand-focus-ring w-full md:w-auto" 
            value={roleFilter} 
            onChange={onRoleChange} 
        />
        <div className="relative flex-1 w-full md:w-auto">
            <select value={skillsFilter} onChange={onSkillsChange} className="p-2.5 h-10 border border-gray-300 rounded-md w-full text-sm focus:ring-1 focus:ring-brand-focus-ring focus:border-brand-focus-ring appearance-none pr-8">
                <option value="">Select Skill</option>
                {manualSkillOptions.map(skill => (<option key={skill} value={skill}>{skill}</option>))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><DropdownArrowIcon /></div>
        </div>
        <div className="relative flex-1 w-full md:w-auto">
            <select value={locationFilter} onChange={onLocationChange} className="p-2.5 h-10 border border-gray-300 rounded-md w-full text-sm focus:ring-1 focus:ring-brand-focus-ring focus:border-brand-focus-ring appearance-none pr-8">
                <option value="">Select Location</option>
                {manualLocationOptions.map(loc => (<option key={loc} value={loc}>{loc}</option>))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><DropdownArrowIcon /></div>
        </div>
        <button className="p-2 h-10 border border-gray-300 rounded-md flex-shrink-0 hover:bg-gray-50 w-full md:w-auto" title="More filters">
            <GeneralFilterIcon />
        </button>
    </>
);


const DashboardPage = () => {
    const navigate = useNavigate();
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [skillsFilter, setSkillsFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [shortlistedIds, setShortlistedIds] = useState(new Set());

    const [currentUserData, setCurrentUserData] = useState({ initial: 'U', name: 'User', email: 'user@example.com' });
    const [isDesktopAvatarDropdownOpen, setIsDesktopAvatarDropdownOpen] = useState(false);
    const [isMobileAvatarDropdownOpen, setIsMobileAvatarDropdownOpen] = useState(false);
    const desktopAvatarRef = useRef(null);
    const mobileAvatarRef = useRef(null);

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            try {
                const parsedInfo = JSON.parse(storedUserInfo);
                setCurrentUserData({
                    initial: parsedInfo.name ? parsedInfo.name.substring(0, 1).toUpperCase() : (parsedInfo.email ? parsedInfo.email.substring(0,1).toUpperCase() : 'U'),
                    name: parsedInfo.name || "User",
                    email: parsedInfo.email || "user@example.com"
                });
            } catch (e) {
                console.error("Failed to parse user info from localStorage for avatar display", e);
            }
        }
    }, []);
    
    const handleClickOutside = (event, ref, setOpenState) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setOpenState(false);
        }
    };

    useEffect(() => {
        const desktopHandler = (event) => handleClickOutside(event, desktopAvatarRef, setIsDesktopAvatarDropdownOpen);
        document.addEventListener('mousedown', desktopHandler);
        return () => document.removeEventListener('mousedown', desktopHandler);
    }, []);

    useEffect(() => {
        const mobileHandler = (event) => handleClickOutside(event, mobileAvatarRef, setIsMobileAvatarDropdownOpen);
        document.addEventListener('mousedown', mobileHandler);
        return () => document.removeEventListener('mousedown', mobileHandler);
    }, []);


    const fetchProfilesData = useCallback(async () => {
        setLoading(true); setError('');
        try {
            const filters = {};
            if (roleFilter) filters.role = roleFilter;
            if (skillsFilter) filters.skills = skillsFilter;
            if (locationFilter) filters.location = locationFilter;
            const data = await getProfiles(filters);
            console.log("Fetched Profiles Data:", data);
            setProfiles(data || []);
        } catch (err) { setError(err.message || 'Failed to load profiles.'); setProfiles([]); }
        finally { setLoading(false); }
    }, [roleFilter, skillsFilter, locationFilter]);

    useEffect(() => { fetchProfilesData(); }, [fetchProfilesData]);
    
    const handleLogout = () => { 
        localStorage.removeItem('userInfo'); 
        navigate('/login'); 
    };
    
    const isProfileShortlisted = (profileId) => shortlistedIds.has(profileId);
    const handleShortlistToggle = (profileId) => {
        setShortlistedIds(prevIds => {
            const newIds = new Set(prevIds);
            if (newIds.has(profileId)) newIds.delete(profileId); else newIds.add(profileId);
            return newIds;
        });
        console.log(`UI Toggle: Shortlist for profile ${profileId}.`);
    };

    const UserAvatarDropdown = ({ onLogout }) => (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-40 border border-gray-200">
            <div className="px-4 py-3">
                <p className="text-sm font-semibold text-gray-900 truncate">{currentUserData.name}</p>
                <p className="text-xs text-gray-500 truncate">{currentUserData.email}</p>
            </div>
            <div className="border-t border-gray-100"></div>
            <button
                onClick={onLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
                Logout
            </button>
        </div>
    );

    return (
        <div className="min-h-screen">
            <div className={`max-w-screen-2xl-plus mx-auto flex min-h-screen lg:shadow-xl lg:my-0 max-lg:w-full max-lg:mx-0 max-lg:shadow-none`}>
                <aside 
                    className={`w-64 bg-sidebar-bg flex-shrink-0 flex flex-col border-r border-gray-200 print:hidden 
                                md:w-60 md:sticky md:top-0 md:h-screen 
                                ${isMobileSidebarOpen ? 'max-md:flex max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:w-64 max-md:shadow-xl' : 'max-md:hidden'}`}
                >
                    <div className="flex flex-col flex-grow p-4 pt-6">
                        <div>
                            <div className="mb-7 px-2"><img src="/record-logo.png" alt="Record Logo" className="h-7" /></div>
                            <nav>
                                <ul>
                                    <li><a href="#discover" className="flex items-center py-2.5 px-3 rounded-md text-sm font-medium bg-[#afb0b1] text-brand-active-text"><DiscoverIcon /> <span className="ml-3">Discover</span></a></li>
                                    <li><Link to="/shortlist" className="flex items-center py-2.5 px-3 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"><ShortlistIcon /> <span className="ml-3">Shortlist</span></Link></li>
                                    <li><Link to="/hired" className="flex items-center py-2.5 px-3 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"><HiredIcon /> <span className="ml-3">Hired</span></Link></li>
                                </ul>
                            </nav>
                        </div>
                        <div className="mt-auto pt-4">
                            <nav className="mb-4">
                                <ul>
                                    <li><a href="#help" className="flex items-center py-2 px-3 rounded-md text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"><HelpIcon /> <span className="ml-2.5">Help</span></a></li>
                                    <li><a href="#settings" className="flex items-center py-2 px-3 rounded-md text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"><SettingsIcon /> <span className="ml-2.5">Settings</span></a></li>
                                </ul>
                            </nav>
                            <div className="px-3 text-xs text-gray-400 leading-relaxed mb-4">
                                <p>Privacy Policy | Terms & Conditions</p>
                                <p>© 2024 Record Innovation</p>
                            </div>
                        </div>
                    </div>
                    {isMobileSidebarOpen && <button onClick={() => setIsMobileSidebarOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 md:hidden z-50"><CloseIconFull /></button>}
                </aside>
                
                {isMobileSidebarOpen && <div onClick={() => setIsMobileSidebarOpen(false)} className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"></div>}

                <div className={`flex-grow flex flex-col bg-white h-screen overflow-y-auto ${isMobileSidebarOpen ? 'max-md:blur-sm' : ''}`}>
                    {/* Mobile-only Header (Sticky) */}
                    <header className={`md:hidden sticky top-0 z-30 bg-sidebar-bg p-4 border-b border-gray-200 flex items-center justify-between print:hidden`}>
                        <button onClick={() => setIsMobileSidebarOpen(true)} className="text-gray-600 hover:text-gray-800"><BurgerIconFull /></button>
                        <img src="/record-logo.png" alt="Record Logo" className="h-7" />
                        <div className="relative" ref={mobileAvatarRef}>
                            <button onClick={() => setIsMobileAvatarDropdownOpen(prev => !prev)} className="w-8 h-8 rounded-avatar bg-brand-avatar-bg text-white flex items-center justify-center text-sm font-semibold">
                                {currentUserData.initial}
                            </button>
                            {isMobileAvatarDropdownOpen && <UserAvatarDropdown onLogout={handleLogout} />}
                        </div>
                    </header>

                    {/* Desktop Sticky Header (includes title AND filters) */}
                    <div className="hidden md:block sticky top-0 z-30 bg-white px-8 py-6 border-b border-gray-200">
                        <header className="flex justify-between items-center">
                            <div className="flex-1"></div>
                            <div className="text-center flex-shrink-0 px-4">
                                <h1 className="text-2xl font-semibold text-gray-900">Search Verified Profiles</h1>
                                <p className="text-sm text-gray-500 mt-1 max-w-xl mx-auto">No Junk, No Spam, No Fluff and No Bluff. All information are pre-vetted and thoroughly verified. Find classic green check marks for more confirmation.</p>
                            </div>
                            <div className="flex-1 flex justify-end">
                                <div className="flex items-center space-x-3">
                                    <button className="p-2 rounded-md bg-brand-plus-icon text-white flex items-center justify-center w-8 h-8"><PlusIcon /></button>
                                    <button className="p-1.5 text-gray-400 hover:text-gray-600"><BellIcon /></button>
                                    <div className="relative" ref={desktopAvatarRef}>
                                        <button onClick={() => setIsDesktopAvatarDropdownOpen(prev => !prev)} className="w-8 h-8 rounded-avatar bg-brand-avatar-bg text-white flex items-center justify-center text-sm font-semibold">
                                            {currentUserData.initial}
                                        </button>
                                        {isDesktopAvatarDropdownOpen && <UserAvatarDropdown onLogout={handleLogout} />}
                                    </div>
                                </div>
                            </div>
                        </header>
                        {/* Desktop Filters (part of the sticky header) */}
                        <section className="flex flex-row gap-4 items-center mt-4">
                           <FilterControls 
                                roleFilter={roleFilter} onRoleChange={(e) => setRoleFilter(e.target.value)}
                                skillsFilter={skillsFilter} onSkillsChange={(e) => setSkillsFilter(e.target.value)}
                                locationFilter={locationFilter} onLocationChange={(e) => setLocationFilter(e.target.value)}
                           />
                        </section>
                    </div>

                    {/* Mobile Title Section (Not sticky) */}
                    <div className="md:hidden px-6 pt-6 pb-4 text-center">
                         <h1 className="text-xl font-semibold text-gray-900">Search Verified Profiles</h1>
                         <p className="text-xs text-gray-500 mt-1">Find pre-vetted talent quickly.</p>
                    </div>
                    
                    {/* Mobile Sticky Filter Section (separate from mobile header) */}
                    <div className={`md:hidden sticky top-[3.75rem] z-20 bg-white shadow-sm px-6 py-4 border-b border-gray-200`}>
                        <section className="flex flex-col gap-4 items-center">
                            <FilterControls
                                roleFilter={roleFilter} onRoleChange={(e) => setRoleFilter(e.target.value)}
                                skillsFilter={skillsFilter} onSkillsChange={(e) => setSkillsFilter(e.target.value)}
                                locationFilter={locationFilter} onLocationChange={(e) => setLocationFilter(e.target.value)}
                            />
                        </section>
                    </div>

                    {/* Profile Grid Area */}
                    <div className="flex-grow px-6 md:px-8 py-6">
                        {loading && <p className="text-center text-gray-500 py-10">Loading profiles...</p>}
                        {error && <p className="text-center text-red-600 bg-red-100 p-4 rounded-md my-4">{error}</p>}
                        {!loading && !error && profiles.length === 0 && <p className="text-center text-gray-500 py-10">No profiles found.</p>}
                        
                        {!loading && !error && profiles.length > 0 && (
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2 print:gap-2"> {/* Grid cols updated */}
                                {profiles.map((profile) => (
                                    <article key={profile._id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                                        <div className="flex items-center mb-4">
                                            <div className="w-10 h-10 bg-brand-avatar-bg rounded-avatar text-white flex items-center justify-center text-sm font-semibold mr-3 relative flex-shrink-0">{profile.avatarInitial || profile.name?.substring(0, 2).toUpperCase() || 'P'}
                                                {profile.isVerified && <span className="absolute -bottom-1 -right-1 bg-green-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-xs border-2 border-white" title="Verified">✓</span>}
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <h3 className="text-base font-semibold text-gray-800 truncate flex items-center">
                                                    {profile.name} | {profile.role}
                                                    <button onClick={() => handleShortlistToggle(profile._id)} title={isProfileShortlisted(profile._id) ? "Remove from shortlist" : "Add to shortlist"}
                                                        className={`ml-2 p-0.5 rounded-full transition-colors focus:outline-none ${isProfileShortlisted(profile._id) ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-gray-500'}`}>
                                                        {isProfileShortlisted(profile._id) ? <StarIconFilled /> : <StarIconOutline />}
                                                    </button>
                                                </h3>
                                                <p className="text-xs text-gray-500 truncate"><LocationFilterIcon />{profile.location} - {profile.employmentType}</p>
                                            </div>
                                            <button
                                                className="ml-3 bg-brand-button hover:opacity-90 text-white py-1.5 px-3.5 rounded-md text-xs font-medium flex-shrink-0"
                                            >
                                                View Profile
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-3">{profile.description}</p>
                                        {profile.skills && profile.skills.length > 0 && (
                                            <div className="mt-auto pt-3 border-t border-gray-100">
                                                <strong className="text-xs font-medium text-gray-700 mb-2 block">Skilled in:</strong>
                                                <div className="flex flex-wrap gap-2">
                                                    {profile.skills.map((skill, idx) => (
                                                        <div key={idx} className="bg-gray-100 border border-gray-200 text-gray-700 px-2.5 py-1 rounded-md text-xs flex flex-col items-start">
                                                            <div className="flex items-center"><EndorsementIconSVG /><span className="font-medium ml-1">{skill.name} ({skill.score || 0})</span></div>
                                                            <span className="text-[10px] text-gray-500 ml-[calc(14px+0.25rem+0.25rem)]">
                                                                {skill.score || 0} Endorsements
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </article>
                                ))}
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;